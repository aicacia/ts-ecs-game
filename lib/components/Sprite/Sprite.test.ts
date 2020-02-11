import * as tape from "tape";
import { Transform3D } from "../..";
import { Entity, Scene } from "../../sceneGraph";
import { Sprite } from "./Sprite";

tape("Sprite", (assert: tape.Test) => {
  const sprite = new Sprite();
  const scene = new Scene().addEntity(
    new Entity().addComponent(new Transform3D(), sprite)
  );

  scene.update();

  assert.end();
});
