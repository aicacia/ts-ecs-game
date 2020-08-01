import { vec2, vec3 } from "gl-matrix";
import {
  Assets,
  Camera2D,
  Camera2DControl,
  Camera2DManager,
  Canvas,
  Component,
  CtxRenderer,
  CtxSpriteRendererHandler,
  CtxTransform2DRendererHandler,
  CtxUIRendererHandler,
  DefaultManager,
  Entity,
  FullScreenCanvas,
  ImageAsset,
  Input,
  Loop,
  Scene,
  Sprite,
  Time,
  Transform2D,
  UIText,
} from "../../src";
import logoPng from "./logo.png";

class Rotator extends Component {
  // only use this if you do not need a manager, it only uses one manager so
  // any other components using the DefaultManager will be in the same manager
  static Manager = DefaultManager;
  static requiredComponents = [Transform2D];
  static requiredPlugins = [Time];

  private rotation = 0.0;

  onUpdate() {
    const delta = this.getRequiredPlugin(Time).getDelta(),
      transform2d = this.getRequiredComponent(Transform2D);

    this.rotation += delta;
    transform2d.setLocalRotation(this.rotation);
    return this;
  }
}

class LookAtCamera extends Component {
  static Manager = DefaultManager;
  static requiredComponents = [Transform2D];

  onUpdate() {
    const cameraPosition = this.getRequiredScene()
      .getRequiredManager(Camera2DManager)
      .getRequiredActive()
      .getRequiredComponent(Transform2D)
      .getPosition();
    this.getRequiredComponent(Transform2D).lookAt(cameraPosition);
    return this;
  }
}

function onLoad() {
  const logoAsset = new ImageAsset(logoPng),
    canvas = new Canvas().set(256, 256),
    scene = new Scene()
      .addEntity(
        // Camera setup
        new Entity()
          .addTag("camera")
          .addComponent(
            new Transform2D().setRenderable(false),
            new Camera2DControl(),
            new Camera2D()
              .setSize(1)
              .setMinSize(1)
              .setMaxSize(16)
              .setBackground(vec3.fromValues(0.98, 0.98, 0.98))
          ),
        new Entity().addComponent(
          new Transform2D(),
          new UIText().setText("Hello, world!")
        ),
        new Entity()
          .addComponent(new Transform2D())
          .addChild(
            new Entity().addComponent(
              new Transform2D()
                .setLocalPosition(vec2.fromValues(9, 0))
                .setRenderable(false),
              new LookAtCamera(),
              new Sprite(logoAsset)
            )
          ),
        new Entity()
          .addComponent(new Transform2D(), new Rotator())
          .addChild(
            new Entity().addComponent(
              new Transform2D().setLocalPosition(vec2.fromValues(9, 0))
            )
          )
      )
      .addPlugin(
        new CtxRenderer(canvas.getElement()).addRendererHandler(
          new CtxTransform2DRendererHandler(),
          new CtxSpriteRendererHandler(),
          new CtxUIRendererHandler()
        ),
        // Required by many Components and plugins
        new Time(),
        // Handles all input
        new Input(canvas.getElement()),
        // forces a canvas to stay in sync with the window size
        new FullScreenCanvas(canvas),
        // assets
        new Assets().addAsset(logoAsset).loadAllInBackground()
      ),
    loop = new Loop(() => scene.update());

  (window as any).scene = scene;
  (window as any).loop = loop;

  document.body.appendChild(canvas.getElement());
  loop.start();
}

window.addEventListener("load", onLoad);
