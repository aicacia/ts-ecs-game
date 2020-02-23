import { RenderableComponent } from "./RenderableComponent";

export type RunOnUpdateFn = () => void;

export abstract class RunOnUpdateComponent extends RenderableComponent {
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

      queue.forEach(event => {
        event();
      });
      this.swap.length = 0;
    }
    return this;
  }
}
