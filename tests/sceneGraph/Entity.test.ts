import * as tape from "tape";
import { Entity, Scene } from "../../lib";
import { Test, TestManager } from "./helpers";

tape("Entity", (assert: tape.Test) => {
  const child = new Entity().addComponent(new Test()),
    parent = new Entity().addComponent(new Test()).addChild(child);

  const scene = new Scene().addEntity(parent);

  scene.update();

  assert.equal(parent.getChildren().length, 1);
  assert.equal(parent.getDepth(), 0);
  assert.true(parent.getScene().isSome());

  assert.equal(child.getChildren().length, 0);
  assert.equal(child.getDepth(), 1);
  assert.true(child.getScene().isSome());

  assert.true(!!scene.getManager(TestManager));

  assert.end();
});
