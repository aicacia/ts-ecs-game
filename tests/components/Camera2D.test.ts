import { mat2d, vec2 } from "gl-matrix";
import * as tape from "tape";
import { Camera2D, Entity, Scene, Transform2D } from "../../lib";

tape("Camera2D", (assert: tape.Test) => {
  const camera = new Camera2D().set(256, 256);
  const scene = new Scene().addEntity(
    new Entity().addComponent(
      new Transform2D().setPosition(vec2.fromValues(1, 1)),
      camera
    )
  );

  scene.update();

  assert.deepEqual(camera.getView(), mat2d.fromValues(1, 0, 0, 1, -1, -1));
  assert.deepEqual(
    camera.getProjection(),
    mat2d.fromValues(0.5, 0, 0, 0.5, 0, 0)
  );

  assert.end();
});