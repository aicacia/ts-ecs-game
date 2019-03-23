import { vec2, vec4 } from "gl-matrix";
import {
  Camera2DBuilder,
  Canvas,
  CtxRenderer,
  Input,
  Loop,
  PointType,
  Polygon2DBuilder,
  Scene,
  Time
} from "../../lib";

const canvas = new Canvas().set(256, 256),
  scene = new Scene()
    .addEntity(
      new Camera2DBuilder()
        .mapCamera2D(camera =>
          camera
            .setOrthographicSize(1.5)
            .setBackground(vec4.fromValues(0.9, 0.9, 0.9, 1.0))
        )
        .build()
        .addTag("camera"),
      new Polygon2DBuilder()
        .addPoint(vec2.fromValues(0, 1), point =>
          point.setType(PointType.Triangle)
        )
        .addPoint(vec2.fromValues(0, 0))
        .addPoint(vec2.fromValues(1, 0), point =>
          point.setType(PointType.Triangle)
        )
        .build()
        .addTag("triangle")
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
