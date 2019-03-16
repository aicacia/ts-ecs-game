import { vec2, vec4 } from "gl-matrix";
import {
  Camera2D,
  Canvas,
  CtxRendererPlugin,
  Entity,
  Line,
  Loop,
  Point,
  Scene,
  Transform2D
} from "../../lib";

const canvas = new Canvas().set(256, 256),
  start = new Entity()
    .addTag("start-point")
    .addComponent(
      new Point(),
      new Transform2D().setPosition(vec2.fromValues(0, 0))
    ),
  end = new Entity()
    .addTag("end-point")
    .addComponent(
      new Point(),
      new Transform2D().setPosition(vec2.fromValues(0.5, 0.5))
    ),
  line = new Entity().addTag("line").addComponent(new Line(start, end)),
  scene = new Scene()
    .addEntity(
      new Entity()
        .addTag("camera")
        .addComponent(
          new Camera2D()
            .setBackground(vec4.fromValues(0.9, 0.9, 0.9, 1.0)),
          new Transform2D()
        ),
      start,
      end,
      line
    )
    .addPlugin(new CtxRendererPlugin(canvas)),
  loop = new Loop(() => scene.update());

const app = document.getElementById("app");

if (app) {
  app.appendChild(canvas.getElement());
}

loop.start();
