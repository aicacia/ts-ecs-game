import { vec2, vec3, vec4 } from "gl-matrix";
import {
  Axis,
  Body2D,
  Camera2D,
  Camera2DControl,
  Camera2DManager,
  Canvas,
  Component,
  CtxRenderer,
  DefaultManager,
  Entity,
  Grid,
  Input,
  Loop,
  Point,
  Scene,
  Time,
  Transform2D,
  World2D
} from "../../lib";
import { PlotBuilder } from "../../lib/components";
import { Body, Circle } from "../../lib/external/collide_2d";

const VEC2_0 = vec2.create();

class MouseBall extends Component {
  static componentName = "simple.MouseBall";
  // only use this if you do not need a manager, it only uses the one manager so
  // any other components using the DefaultManager will be in the same manager
  static Manager = DefaultManager;

  onAdd() {
    this.getRequiredComponent(Body2D)
      .getBody()
      .on("collide-start", (b, c) => {
        console.log("collide-start", c.depth);
      })
      .on("colliding", (b, c) => {
        console.log("colliding", c.depth);
      })
      .on("collide-end", (b, c) => {
        console.log("collide-end", c.depth);
      });
    return this;
  }

  onUpdate() {
    const input = this.getRequiredPlugin(Input),
      camera = this.getScene()
        .flatMap(scene => scene.getManager(Camera2DManager))
        .flatMap(camera2DManager => camera2DManager.getActive())
        .unwrap(),
      position = camera.toWorld(
        VEC2_0,
        vec2.set(VEC2_0, input.getValue("mouseX"), input.getValue("mouseY"))
      ),
      body = this.getComponent(Body2D).unwrap();

    body.getBody().setPosition(position);

    return this;
  }
}

const canvas = new Canvas().set(512, 512),
  scene = new Scene()
    .addEntity(
      // axis
      new Entity().addComponent(new Axis()),
      // grid
      new Entity().addComponent(new Grid()),
      // Camera setup
      new Entity().addTag("camera").addComponent(
        new Transform2D(),
        new Camera2DControl(),
        new Camera2D()
          .setSize(10)
          .setMinSize(1)
          .setMaxSize(16)
          .setBackground(vec3.fromValues(0.98, 0.98, 0.98))
      ),
      new Entity()
        .addTag("mouse")
        .addComponent(
          new Transform2D(),
          new Point(),
          new MouseBall(),
          new Body2D(new Body().addShape(new Circle().setRadius(0.25)))
        ),
      new Entity()
        .addTag("body")
        .addComponent(
          new Transform2D().setLocalPosition(vec2.fromValues(0, 1.0)),
          new Point(),
          new Body2D(new Body().addShape(new Circle().setRadius(0.25)))
        ),
      new PlotBuilder({
        connected: false,
        color: vec4.fromValues(1.0, 1.0, 0.0, 1.0)
      })
        .addPoints([
          { point: vec2.fromValues(0, 0) },
          { point: vec2.fromValues(1, 1) },
          { point: vec2.fromValues(2, 4) },
          { point: vec2.fromValues(3, 9) },
          { point: vec2.fromValues(4, 16) }
        ])
        .build()
    )
    .addPlugin(
      // Handles all rendering
      new CtxRenderer(canvas),
      // Required by many Components and plugins
      new Time(),
      // Handles all input
      new Input(canvas.getElement()),
      // collisions
      new World2D()
    ),
  loop = new Loop(() => scene.update());

const app = document.getElementById("app");

if (app) {
  app.style.left = "0px";
  app.style.top = "0px";
  app.style.position = "relative";
  app.style.overflow = "hidden";
  app.style.width = `${canvas.getWidth()}px`;
  app.style.height = `${canvas.getHeight()}px`;
  app.appendChild(canvas.getElement());
}

loop.start();
