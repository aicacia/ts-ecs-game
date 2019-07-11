import { mat2d, vec2 } from "gl-matrix";
import * as tape from "tape";
import { Entity, Scene, Transform2D } from "../..";

tape("Transform2D", (assert: tape.Test) => {
  const child = new Entity().addTag("child").addComponent(new Transform2D()),
    parent = new Entity()
      .addTag("parent")
      .addComponent(
        new Transform2D()
          .setLocalRotation(Math.PI * 0.5)
          .setLocalScale(vec2.fromValues(2, 2))
          .setLocalPosition(vec2.fromValues(1, 1))
      )
      .addChild(child);

  const scene = new Scene().addEntity(parent);

  scene.update();

  const parentTransform = parent.getRequiredComponent(Transform2D);
  const childTransform = child.getRequiredComponent(Transform2D);

  assert.true(
    mat2d.equals(
      parentTransform.getMatrix(),
      mat2d.fromValues(0, 2, -2, 0, 1, 1)
    ),
    `[${parentTransform.getMatrix()}] = [${mat2d.fromValues(
      0,
      2,
      -2,
      0,
      1,
      1
    )}]`
  );
  assert.true(
    mat2d.equals(
      childTransform.getMatrix(),
      mat2d.fromValues(0, 2, -2, 0, 1, 1)
    ),
    `[${childTransform.getMatrix()}] = [${mat2d.fromValues(0, 2, -2, 0, 1, 1)}]`
  );

  assert.end();
});
