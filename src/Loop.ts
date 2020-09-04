import raf = require("raf");

export type ILoopHandler = (ms: number) => void;

export class Loop {
  private id: number | null = null;
  private running = false;
  private handler: ILoopHandler;
  private resolve?: () => void;

  constructor(handler: ILoopHandler) {
    this.handler = handler;
  }

  getHandler() {
    return this.handler;
  }
  setHandler(handler: ILoopHandler) {
    this.handler = handler;
    return this;
  }

  start() {
    this.running = true;
    return new Promise<void>((resolve) => {
      this.resolve = resolve;
      this.request();
    });
  }
  stop() {
    this.running = false;

    if (this.id !== null) {
      raf.cancel(this.id);
      this.id = null;
    }
    return this;
  }
  isStopped() {
    return this.running === false;
  }

  private run = (ms: number) => {
    this.handler(ms);

    if (this.running) {
      this.request();
    } else if (this.resolve) {
      this.resolve();
      this.resolve = undefined;
    }
    return this;
  };

  private request() {
    this.id = raf(this.run);
    return this;
  }
}
