import * as tape from "tape";
import { EventLoop } from "./EventLoop";
import { Input } from "./plugins";

tape("EventLoop", (assert: tape.Test) => {
  const input = new Input();
  let count = 0;

  const handler = () => {
    count += 1;
  };

  const loop = new EventLoop(input, handler);

  assert.true(loop.isStopped());

  input.emit("events", [{ type: "resize" }]);
  input.emit("events", [{ type: "resize" }]);
  input.emit("events", [{ type: "resize" }]);

  setTimeout(() => {
    assert.equal(count, 1);
    assert.end();
  }, 10);
});
