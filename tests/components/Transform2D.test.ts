import { mat2d, vec2 } from "gl-matrix";
import * as tape from "tape";
import { Entity, Scene, Transform2D } from "../../lib";

tape("Transform2D", (assert: tape.Test) => {
  const child = new Entity().addTag("child").addComponent(new Transform2D()),
    parent = new Entity()
      .addTag("parent")
      .addComponent(new Transform2D().setPosition(vec2.fromValues(1, 1)))
      .addChild(child);

  const scene = new Scene().addEntity(parent);

  scene.update();

  const parentTransform = parent.getComponent(Transform2D).unwrap();
  const childTransform = child.getComponent(Transform2D).unwrap();

  assert.deepEqual(
    parentTransform.getMatrix(),
    mat2d.fromValues(1, 0, 0, 1, 1, 1)
  );
  assert.deepEqual(
    childTransform.getMatrix(),
    mat2d.fromValues(1, 0, 0, 1, 1, 1)
  );

  assert.end();
});
