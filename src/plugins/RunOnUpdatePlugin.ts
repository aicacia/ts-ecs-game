import { Plugin } from "../Plugin";
import { RunOnUpdateFn } from "../RunOnUpdateFn";

export abstract class RunOnUpdatePlugin extends Plugin {
  private queue: RunOnUpdateFn<this>[] = [];
  private swap: RunOnUpdateFn<this>[] = [];

  runOnUpdate(...fns: RunOnUpdateFn<this>[]) {
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
