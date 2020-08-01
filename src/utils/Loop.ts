import raf = require("raf");

export class Loop {
  private id: number | null = null;
  private running = false;
  private handler: (ms: number) => void;

  constructor(handler: (ms: number) => void) {
    this.handler = handler;
  }

  start() {
    this.running = true;
    this.request();
    return this;
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
    }
    return this;
  };

  private request() {
    this.id = raf(this.run);
    return this;
  }
}
