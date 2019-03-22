import { vec2, vec4 } from "gl-matrix";
import {
  Camera2D,
  Canvas,
  CtxRenderer,
  Entity,
  Input,
  Loop,
  PolygonBuilder,
  Scene,
  Time,
  Transform2D
} from "../../lib";

const canvas = new Canvas().set(512, 256),
  scene = new Scene()
    .addEntity(
      new Entity()
        .addTag("camera")
        .addComponent(
          new Camera2D()
            .setOrthographicSize(1)
            .setBackground(vec4.fromValues(0.9, 0.9, 0.9, 1)),
          new Transform2D()
        ),
      new PolygonBuilder()
        .addPoint(vec2.fromValues(0, 0))
        .addPoint(vec2.fromValues(1, 0))
        .addPoint(vec2.fromValues(1, 1))
        .build()
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
