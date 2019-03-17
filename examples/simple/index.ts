import { vec2, vec4 } from "gl-matrix";
import {
  Camera2D,
  Canvas,
  Component,
  CtxRendererPlugin,
  Entity,
  Line,
  Loop,
  Manager,
  Point,
  Scene,
  Time,
  Transform2D
} from "../../lib";

class RotatorManager extends Manager {
  static managerName = "example.RotatorManager";
}

class Rotator extends Component {
  static componentName = "example.Rotator";
  static Manager = RotatorManager;

  onUpdate() {
    const time = this.getScene()
      .flatMap(scene => scene.getPlugin(Time))
      .unwrap();

    this.getEntity()
      .flatMap(entity => entity.getComponent(Transform2D))
      .map(transform2d => {
        const x = Math.cos(time.getCurrent()),
          y = Math.sin(time.getCurrent());

        transform2d.setLocalPosition(vec2.fromValues(x, y));
      });
    return this;
  }
}

const canvas = new Canvas().set(256, 256),
  start = new Entity()
    .addTag("start-point")
    .addComponent(
      new Point(),
      new Transform2D().setLocalPosition(vec2.fromValues(0, 0))
    ),
  end = new Entity()
    .addTag("end-point")
    .addComponent(
      new Point(),
      new Rotator(),
      new Transform2D().setLocalPosition(vec2.fromValues(0.5, 0.5))
    ),
  line = new Entity().addTag("line").addComponent(new Line(start, end)),
  scene = new Scene()
    .addEntity(
      new Entity()
        .addTag("camera")
        .addComponent(
          new Camera2D().setBackground(vec4.fromValues(0.9, 0.9, 0.9, 1.0)),
          new Transform2D()
        ),
      start,
      end,
      line
    )
    .addPlugin(new Time(), new CtxRendererPlugin(canvas)),
  loop = new Loop(() => scene.update());

const app = document.getElementById("app");

if (app) {
  app.appendChild(canvas.getElement());
}

loop.start();
