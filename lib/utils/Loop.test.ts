import * as tape from "tape";
import { Loop } from "./Loop";

tape("Loop", (assert: tape.Test) => {
  let count = 0;

  const handler = () => {
    if (++count === 60) {
      loop.stop();
      assert.true(loop.isStopped());
      assert.end();
    }
  };

  const loop = new Loop(handler);

  assert.true(loop.isStopped());

  loop.start();

  assert.false(loop.isStopped());
});
