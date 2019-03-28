import { vec2, vec3, vec4 } from "gl-matrix";
import {
  Arc,
  Axis,
  Camera2D,
  Camera2DControl,
  Canvas,
  Component,
  CtxRenderer,
  DefaultManager,
  Entity,
  Grid,
  HTML,
  Input,
  Line,
  LineType,
  Loop,
  Point,
  PointType,
  Scene,
  Time,
  Transform2D
} from "../../lib";

class Rotator extends Component {
  static componentName = "simple.Rotator";
  // only use this if you do not need a manager, it only uses the one manager so
  // any other components using the DefaultManager will be in the same manager
  static Manager = DefaultManager;

  onUpdate() {
    const current = this.getPlugin(Time)
        .unwrap()
        .getCurrent(),
      transform2d = this.getComponent(Transform2D).unwrap();

    transform2d.setLocalRotation(current);

    return this;
  }
}

class ArcHandler extends Component {
  static componentName = "simple.ArcHandler";
  static Manager = DefaultManager;

  onUpdate() {
    const current = this.getPlugin(Time)
        .unwrap()
        .getCurrent(),
      arc = this.getComponent(Arc).unwrap();

    arc.setEnd((current - Math.PI / 4) % (Math.PI * 2));

    return this;
  }
}

const element = document.createElement("p");

element.textContent = "Hello, world!";

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
      // Rotating line
      new Entity()
        .addTag("line-0")
        .addComponent(
          new Transform2D(),
          new Line().setLength(9),
          new Point(),
          new Rotator()
        )
        .addChild(
          // Lines arrow
          new Entity()
            .addComponent(
              new Transform2D().setLocalPosition(vec2.fromValues(9, 0)),
              new Point().setType(PointType.Triangle)
            )
            // HTML overlay text
            .addChild(
              new Entity().addComponent(new Transform2D(), new HTML(element))
            )
        ),
      // Static line
      new Entity()
        .addTag("line-1")
        .addComponent(
          new Transform2D().setLocalRotation(Math.PI / 4),
          new Line().setType(LineType.Dashed).setLength(9),
          new Point(),
          new Arc().setColor(vec4.fromValues(0, 0, 0.9, 1)),
          new ArcHandler()
        )
        .addChild(
          new Entity().addComponent(
            new Transform2D().setLocalPosition(vec2.fromValues(9, 0)),
            new Point().setType(PointType.Triangle)
          )
        )
    )
    .addPlugin(
      // Handles all rendering
      new CtxRenderer(canvas),
      // Required by many Components and plugins
      new Time(),
      // Handles all input
      new Input(canvas.getElement())
    ),
  loop = new Loop(() => scene.update());

const app = document.getElementById("app"),
  download = document.getElementById("download");

if (app) {
  app.style.left = "0px";
  app.style.top = "0px";
  app.style.position = "relative";
  app.style.overflow = "hidden";
  app.style.width = `${canvas.getWidth()}px`;
  app.style.height = `${canvas.getHeight()}px`;
  app.appendChild(element);
  app.appendChild(canvas.getElement());
}
if (download) {
  download.onclick = () => window.open(canvas.getImageURI());
}

loop.start();
