import { Camera2D, Entity, Scene, Transform2D } from "../../lib";

const scene = new Scene().addEntity(
  new Entity().addComponent(new Camera2D(), new Transform2D())
);

scene.update();
