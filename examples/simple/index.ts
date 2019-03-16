import { Camera2D, Canvas, Entity, Scene, Transform2D } from "../../lib";

const canvas = new Canvas(),
  scene = new Scene().addEntity(
    new Entity().addComponent(new Camera2D(), new Transform2D())
  );

scene.update();

document.getElementById("app").appendChild(canvas.set(256, 256).getElement());
