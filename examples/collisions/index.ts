import { vec2, vec3, vec4 } from "gl-matrix";
import {
  Axis,
  Body2D,
  Camera2D,
  Camera2DControl,
  Camera2DManager,
  Canvas,
  Control,
  CtxRenderer,
  DefaultManager,
  Entity,
  FullScreenCanvas,
  Grid,
  Input,
  Loop,
  Point,
  Scene,
  Time,
  Transform2D,
  World2D
} from "../../lib";
import { PausableComponent, PlotBuilder } from "../../lib/components";
import { Body, Capsule, Circle } from "../../lib/external/collide_2d";
import { Contact } from "../../lib/external/collide_2d/phases/Contact";

const VEC2_0 = vec2.create(),
  VEC2_1 = vec2.create();

class MouseBall extends PausableComponent {
  static componentName = "simple.MouseBall";
  // only use this if you do not need a manager, it only uses the one manager so
  // any other components using the DefaultManager will be in the same manager
  static Manager = DefaultManager;

  onCollideStart = (b: Body, c: Contact) => {
    console.log("collide-start", c.depth);
  };
  onColliding = (b: Body, c: Contact) => {
    console.log("colliding", c.depth);
  };
  onCollideEnd = (b: Body, c: Contact) => {
    console.log("collide-end", c.depth);
  };

  onAdd() {
    this.getRequiredComponent(Body2D)
      .getBody()
      .on("collide-start", this.onCollideStart)
      .on("colliding", this.onColliding)
      .on("collide-end", this.onCollideEnd);
    return this;
  }

  onRemove() {
    this.getRequiredComponent(Body2D)
      .getBody()
      .off("collide-start", this.onCollideStart)
      .off("colliding", this.onColliding)
      .off("collide-end", this.onCollideEnd);
    return this;
  }

  onUpdate() {
    const input = this.getRequiredPlugin(Input),
      camera = this.getRequiredScene()
        .getRequiredManager(Camera2DManager)
        .getRequiredActive(),
      position = camera.toWorld(
        VEC2_0,
        vec2.set(VEC2_1, input.getValue("mouseX"), input.getValue("mouseY"))
      ),
      body = this.getRequiredComponent(Body2D);

    if (!vec2.equals(position, body.getBody().getPosition())) {
      body.getBody().setPosition(position);
    }

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
        .addTag("point")
        .addComponent(
          new Transform2D().setLocalPosition(vec2.fromValues(0, 1.0)),
          new Point(),
          new Body2D(new Body().addShape(new Circle().setRadius(0.25)))
        ),
      new Entity()
        .addTag("capsule")
        .addComponent(
          new Transform2D().setLocalPosition(vec2.fromValues(0, 4.0)),
          new Point(),
          new Body2D(new Body().addShape(new Capsule().setRadius(0.25)))
        ),
      new PlotBuilder({
        connected: true,
        color: vec4.fromValues(1.0, 1.0, 0.0, 1.0)
      })
        .addPoint(
          { point: vec2.fromValues(0, 0) },
          { point: vec2.fromValues(1, 1) },
          { point: vec2.fromValues(2, 4) },
          { point: vec2.fromValues(3, 9) },
          { point: vec2.fromValues(4, 16) }
        )
        .build()
    )
    .addPlugin(
      // Full screen canvas
      new FullScreenCanvas(canvas),
      // Handles all rendering
      new CtxRenderer(canvas),
      // Required by many Components and plugins
      new Time(),
      // Handles all input
      new Input(canvas.getElement()),
      // collisions
      new World2D(),
      // Control
      new Control()
    ),
  loop = new Loop(() => scene.update());

document.getElementById("app")?.appendChild(canvas.getElement());

loop.start();

(window as any).scene = scene;
