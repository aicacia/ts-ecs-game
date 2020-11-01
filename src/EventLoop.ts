import raf = require("raf");
import { ILoopHandler } from "./Loop";
import { Input } from "./plugins";

export class EventLoop {
  private input: Input;
  private id: number | null = null;
  private running = false;
  private handler: ILoopHandler;

  constructor(input: Input, handler: ILoopHandler) {
    this.input = input;
    this.input.on("event", this.start);
    this.handler = handler;
  }

  getInput() {
    return this.input;
  }
  setInput(input: Input) {
    if (this.input) {
      this.input.off("event", this.start);
    }
    this.input = input;
    this.input.on("event", this.start);
    return this;
  }

  getHandler() {
    return this.handler;
  }
  setHandler(handler: ILoopHandler) {
    this.handler = handler;
    return this;
  }

  private start = () => {
    if (!this.running) {
      this.running = true;
      this.request();
    }
  };
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
    this.id = null;
    this.handler(ms);
    this.running = false;
    return this;
  };

  private request() {
    this.id = raf(this.run);
    return this;
  }
}
