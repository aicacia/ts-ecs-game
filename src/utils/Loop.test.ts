import * as tape from "tape";
import { Loop } from "./Loop";

tape("Loop", async (assert: tape.Test) => {
  let count = 0;

  const handler = () => {
    if (++count === 60) {
      loop.stop();
    }
  };

  const loop = new Loop(handler);

  assert.true(loop.isStopped());

  await loop.start();

  assert.true(loop.isStopped());
  assert.end();
});
