import { vec2, vec3, vec4 } from "gl-matrix";
import {
  Camera2D,
  Camera2DControl,
  Camera2DManager,
  Canvas,
  Control,
  CtxRenderer,
  CtxTransform2DRendererHandler,
  DefaultManager,
  Entity,
  FullScreenCanvas,
  Input,
  Loop,
  PausableComponent,
  Scene,
  Time,
  Transform2D
} from "../../lib";

class Rotator extends PausableComponent {
  static componentName = "simple.Rotator";
  // only use this if you do not need a manager, it only uses one manager so
  // any other components using the DefaultManager will be in the same manager
  static Manager = DefaultManager;

  private rotation = 0.0;

  onUpdate() {
    const delta = this.getRequiredPlugin(Time).getDelta(),
      transform2d = this.getRequiredComponent(Transform2D);

    this.rotation += delta;
    transform2d.setLocalRotation(this.rotation);
    return this;
  }
}

class LookAtCamera extends PausableComponent {
  static componentName = "simple.LookAtCamera";
  static Manager = DefaultManager;

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

const canvas = new Canvas().set(512, 512),
  scene = new Scene()
    .addEntity(
      // Camera setup
      new Entity().addTag("camera").addComponent(
        new Transform2D().setRender(false),
        new Camera2DControl(),
        new Camera2D()
          .setSize(8)
          .setMinSize(1)
          .setMaxSize(16)
          .setBackground(vec3.fromValues(0.98, 0.98, 0.98))
      ),
      new Entity()
        .addComponent(new Transform2D())
        .addChild(
          new Entity().addComponent(
            new Transform2D().setLocalPosition(vec2.fromValues(9, 0)),
            new LookAtCamera()
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
      new CtxRenderer(canvas).addRendererHandler(
        new CtxTransform2DRendererHandler()
      ),
      // Required by many Components and plugins
      new Time(),
      // Handles all input
      new Input(canvas.getElement()),
      // Control plugin
      new Control(),
      // forces a fullscreen canvas to stay in sync with the window
      new FullScreenCanvas(canvas)
    ),
  loop = new Loop(() => scene.update());

(window as any).scene = scene;
(window as any).loop = loop;

window.addEventListener("load", () => {
  document.body.appendChild(canvas.getElement());
  loop.start();
});
