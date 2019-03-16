export class Loop {
  private id: number | null = null;
  private running: boolean = false;
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
      cancelAnimationFrame(this.id);
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
    this.id = requestAnimationFrame(this.run);
    return this;
  }
}
