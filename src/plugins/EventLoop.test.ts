import * as tape from "tape";
import { Plugin } from "@aicacia/ecs/lib/Plugin";
import { Scene } from "@aicacia/ecs/lib/Scene";
import { EventLoop } from "./EventLoop";
import { Input } from "./input";

class Counter extends Plugin {
  count = 0;

  onUpdate() {
    this.count += 1;
    return this;
  }
}

tape("EventLoop", (assert: tape.Test) => {
  const input = new Input(),
    loop = new EventLoop(input),
    scene = new Scene().addPlugin(new Counter(), loop);

  assert.true(loop.isStopped());

  scene.init();

  input.emit("event", { type: "resize" });
  input.emit("event", { type: "resize" });
  input.emit("event", { type: "resize" });

  setTimeout(() => {
    assert.equal(scene.getRequiredPlugin(Counter).count, 1);
    assert.end();
  }, 10);
});
