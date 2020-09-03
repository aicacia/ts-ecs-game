import { Plugin } from "../sceneGraph";

export type RunOnUpdateFn = () => void;

export abstract class RunOnUpdatePlugin extends Plugin {
  private queue: RunOnUpdateFn[] = [];
  private swap: RunOnUpdateFn[] = [];

  enqueue(...events: RunOnUpdateFn[]) {
    this.queue.push(...events);
    return this;
  }

  onUpdate() {
    if (this.queue.length > 0) {
      const queue = this.queue;

      this.queue = this.swap;
      this.swap = queue;

      queue.forEach((event) => event());
      this.swap.length = 0;
    }
    return this;
  }
}
