import { vec2, vec4 } from "gl-matrix";
import {
  Camera2D,
  Camera2DManager,
  Component,
  Entity,
  FullScreenCanvas,
  Input,
  Scene,
  Time,
  Transform2D,
  EventLoop,
} from "../../src";
import {
  WebCanvas,
  CtxRenderer,
  TransformCtxRendererHandler,
  WebEventListener,
} from "../../src/web";

class MouseTracker extends Component {
  static requiredComponents = [Transform2D];
  static requiredPlugins = [Input];

  private mousePosition = vec2.create();

  onUpdate() {
    const input = this.getRequiredPlugin(Input);

    vec2.set(
      this.mousePosition,
      input.getButtonValue("mouse-x"),
      input.getButtonValue("mouse-y")
    );
    this.getRequiredSceneManager(Camera2DManager)
      .getRequiredActive()
      .toWorld(this.mousePosition, this.mousePosition);

    this.getRequiredComponent(Transform2D).setLocalPosition(this.mousePosition);
    return this;
  }
}

function onLoad() {
  const canvas = new WebCanvas(
      document.getElementById("canvas") as HTMLCanvasElement
    ).set(256, 256),
    input = new Input().addEventListener(
      new WebEventListener(canvas.getElement())
    ),
    scene = new Scene()
      .addEntity(
        // Camera setup
        new Entity()
          .addTag("camera")
          .addComponent(
            new Transform2D().setRenderable(false),
            new Camera2D().setBackground(vec4.fromValues(0.98, 0.98, 0.98, 1.0))
          ),
        new Entity().addComponent(new Transform2D(), new MouseTracker())
      )
      .addPlugin(
        new CtxRenderer(
          canvas,
          canvas.getElement().getContext("2d")
        ).addRendererHandler(new TransformCtxRendererHandler()),
        // Required by many Components and plugins
        new Time(),
        // Handles all input
        input,
        // forces a canvas to stay in sync with the window size
        new FullScreenCanvas(canvas)
      );

  new EventLoop(input, () => {
    scene.update();
  });

  scene.update();
}

window.addEventListener("load", onLoad);
