import * as tape from "tape";
import { Entity, Scene } from "../../lib";
import { Test, TestPlugin } from "./helpers";

tape("Scene", (assert: tape.Test) => {
  const scene = new Scene().addEntity(
    new Entity()
      .addTag("parent")
      .addComponent(new Test())
      .addChild(new Entity().addTag("child").addComponent(new Test()))
  );

  scene.addPlugin(new TestPlugin());

  scene.update();

  const parent = scene.find(entity => entity.hasTag("parent")).unwrap();
  assert.true(parent.isRoot());
  assert.equal(parent.getDepth(), 0);
  assert.deepEqual(parent.getTags(), ["parent"]);

  const child = scene.find(entity => entity.hasTag("child")).unwrap();
  assert.false(child.isRoot());
  assert.equal(child.getDepth(), 1);
  assert.deepEqual(child.getTags(), ["child"]);

  assert.end();
});
