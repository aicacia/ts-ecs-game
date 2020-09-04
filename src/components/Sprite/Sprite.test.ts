import * as tape from "tape";
import { Transform3D } from "../..";
import { ImageAsset, Time } from "../../plugins";
import { Entity, Scene } from "../..";
import { Sprite } from "./Sprite";

class TestImageAsset extends ImageAsset {
  getWidth() {
    return 1;
  }
  getHeight() {
    return 1;
  }
  loadAsset() {
    return Promise.resolve();
  }
  unloadAsset() {
    return Promise.resolve();
  }
}

tape("Sprite", (assert: tape.Test) => {
  const sprite = new Sprite(new TestImageAsset());
  const scene = new Scene()
    .addEntity(new Entity().addComponent(new Transform3D(), sprite))
    .addPlugin(new Time());

  scene.update();

  assert.end();
});
