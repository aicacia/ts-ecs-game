import { vec2, vec3 } from "gl-matrix";
import {
  Assets,
  Camera2D,
  Camera2DControl,
  Camera2DManager,
  Component,
  Entity,
  FullScreenCanvas,
  Input,
  Scene,
  Sprite,
  Time,
  Loop,
  Transform2D,
  UIText,
} from "../../src";
import {
  WebCanvas,
  CtxRenderer,
  SpriteCtxRendererHandler,
  TransformCtxRendererHandler,
  UICtxRendererHandler,
  WebImageAsset,
  WebEventListener,
} from "../../src/web";
import logoPng from "./logo.png";

class Rotator extends Component {
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
  const logoAsset = new WebImageAsset(logoPng),
    canvas = new WebCanvas().set(256, 256),
    scene = new Scene()
      .addEntity(
        // Camera setup
        new Entity()
          .addTag("camera")
          .addComponent(
            new Transform2D().setRenderable(false),
            new Camera2DControl(),
            new Camera2D().setBackground(vec3.fromValues(0.98, 0.98, 0.98))
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
                .setLocalPosition(vec2.fromValues(3, 0))
                .setRenderable(false),
              new LookAtCamera(),
              new Sprite(logoAsset)
            )
          ),
        new Entity()
          .addComponent(new Transform2D(), new Rotator())
          .addChild(
            new Entity().addComponent(
              new Transform2D().setLocalPosition(vec2.fromValues(0, 3))
            )
          )
      )
      .addPlugin(
        new CtxRenderer(
          canvas,
          canvas.getElement().getContext("2d")
        ).addRendererHandler(
          new TransformCtxRendererHandler(),
          new SpriteCtxRendererHandler(),
          new UICtxRendererHandler()
        ),
        // Required by many Components and plugins
        new Time(),
        // Handles all input
        new Input().addEventListener(new WebEventListener(canvas.getElement())),
        // forces a canvas to stay in sync with the window size
        new FullScreenCanvas(canvas),
        // assets
        new Assets().addAsset(logoAsset).loadAllInBackground()
      ),
    loop = new Loop(() => scene.update());

  (window as any).scene = scene;
  (window as any).loop = loop;

  canvas.getElement().style.position = "absolute";
  canvas.getElement().style.left = "0px";
  canvas.getElement().style.top = "0px";
  document.body.appendChild(canvas.getElement());
  loop.start();
}

window.addEventListener("load", onLoad);
