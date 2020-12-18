import { Plugin } from "@aicacia/ecs/lib/Plugin";
import { IRunOnUpdateFn } from "../IRunOnUpdateFn";

export abstract class RunOnUpdatePlugin extends Plugin {
  private queue: IRunOnUpdateFn<this>[] = [];
  private swap: IRunOnUpdateFn<this>[] = [];

  runOnUpdate(...fns: IRunOnUpdateFn<this>[]) {
    this.queue.push(...fns);
    return this;
  }

  onUpdate() {
    if (this.queue.length > 0) {
      const queue = this.queue;

      this.queue = this.swap;
      this.swap = queue;

      queue.forEach((fn) => fn.call(this));
      this.swap.length = 0;
    }
    return this;
  }
}
