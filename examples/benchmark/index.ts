import { XorShiftRng } from "@aicacia/rand";
import { Component, Entity, Scene } from "@aicacia/ecs";
import {
  Assets,
  Camera2D,
  Camera2DControl,
  FullScreenCanvas,
  Input,
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
  UITextCtxRendererHandler,
  WebImageAsset,
  WebEventListener,
} from "../../src/web";
// @ts-ignore
import logoPng from "../assets/logo.png";

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

class UIFPS extends Component {
  static requiredComponents = [UIText];
  static requiredPlugins = [Time];

  onUpdate() {
    const time = this.getRequiredPlugin(Time),
      uiText = this.getRequiredComponent(UIText);

    uiText.setText(time.getFps().toFixed(2) + "fps");
    return this;
  }
}

function onLoad() {
  const logoAsset = new WebImageAsset(logoPng),
    canvas = new WebCanvas(
      document.getElementById("canvas") as HTMLCanvasElement
    ),
    scene = new Scene()
      .addEntity(
        // Camera setup
        new Entity()
          .addTag("camera")
          .addComponent(
            new Transform2D().setRenderable(false).setLocalScale2([10, 10]),
            new Camera2DControl(),
            new Camera2D().setBackground([0.98, 0.98, 0.98, 1.0])
          ),
        new Entity().addComponent(
          new Transform2D(),
          new UIText().setSize(10),
          new UIFPS()
        )
      )
      .addPlugin(
        new CtxRenderer(
          canvas,
          canvas.getElement().getContext("2d")
        ).addRendererHandler(
          new SpriteCtxRendererHandler(),
          new UITextCtxRendererHandler()
        ),
        new Time(),
        new Input().addEventListener(new WebEventListener(canvas.getElement())),
        new FullScreenCanvas(canvas),
        new Assets().addAsset(logoAsset).loadAllInBackground(),
        new Loop()
      );

  const rng = new XorShiftRng();
  for (let i = 0, il = 100; i < il; i++) {
    scene.addEntity(
      new Entity().addComponent(
        new Transform2D().setLocalPosition2([
          rng.nextIntInRange(-10, 10),
          rng.nextIntInRange(-10, 10),
        ]),
        new Rotator(),
        new Sprite().setImageAsset(logoAsset)
      )
    );
  }

  scene.init();
}

window.addEventListener("load", onLoad);
