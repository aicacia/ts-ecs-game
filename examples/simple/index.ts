import { vec2, vec4 } from "gl-matrix";
import {
  Camera2D,
  Canvas,
  Component,
  CtxRenderer,
  Entity,
  Grid,
  Input,
  Line,
  Loop,
  Manager,
  Point,
  PointType,
  Scene,
  Time,
  Transform2D
} from "../../lib";

class RotatorManager extends Manager {
  static managerName = "simple.RotatorManager";
}

class Rotator extends Component {
  static componentName = "simple.Rotator";
  static Manager = RotatorManager;

  onUpdate() {
    const current = this.getPlugin(Time)
      .unwrap()
      .getCurrent();

    this.getComponent(Transform2D).map(transform2d => {
      transform2d.setLocalRotation(current);
    });
    return this;
  }
}

const canvas = new Canvas().set(256, 256),
  scene = new Scene()
    .addEntity(
      new Entity().addComponent(
        new Grid().setColor(vec4.fromValues(0, 0, 0, 0.05)).setSize(0.5)
      ),
      new Entity().addComponent(new Grid()),
      new Entity()
        .addTag("camera")
        .addComponent(
          new Transform2D(),
          new Camera2D()
            .setOrthographicSize(10)
            .setBackground(vec4.fromValues(0.9, 0.9, 0.9, 1.0))
        ),
      new Entity()
        .addTag("line")
        .addComponent(
          new Transform2D(),
          new Line().setLength(9),
          new Point(),
          new Rotator()
        )
        .addChild(
          new Entity().addComponent(
            new Transform2D().setLocalPosition(vec2.fromValues(0, 9)),
            new Point().setType(PointType.Triangle)
          )
        )
    )
    .addPlugin(
      new Time(),
      new CtxRenderer(canvas),
      new Input(canvas.getElement())
    ),
  loop = new Loop(() => scene.update());

const app = document.getElementById("app");

(window as any).scene = scene;

if (app) {
  app.appendChild(canvas.getElement());
}

loop.start();
