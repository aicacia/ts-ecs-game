import * as tape from "tape";
import { Transform3D } from "../..";
import { ImageAsset, Time } from "../../plugins";
import { Entity, Scene } from "../../sceneGraph";
import { Sprite } from "./Sprite";

tape("Sprite", (assert: tape.Test) => {
  const sprite = new Sprite(new ImageAsset(""));
  const scene = new Scene()
    .addEntity(new Entity().addComponent(new Transform3D(), sprite))
    .addPlugin(new Time());

  scene.update();

  assert.end();
});
