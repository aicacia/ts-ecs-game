import raf = require("raf");
import { Input } from "./input";
import { Plugin } from "../Plugin";

export class EventLoop extends Plugin {
  private input: Input;
  private id: number | null = null;
  private running = false;

  constructor(input: Input) {
    super();
    this.input = input;
    this.input.on("event", this.start);
  }

  getInput() {
    return this.input;
  }
  setInput(input: Input) {
    this.input.off("event", this.start);
    this.input = input;
    this.input.on("event", this.start);
    return this;
  }

  start = () => {
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

  private run = (_ms: number) => {
    this.id = null;
    this.getRequiredScene().update();
    this.running = false;
    return this;
  };

  private request() {
    this.id = raf(this.run);
    return this;
  }

  onInit() {
    this.start();
    return this;
  }
}
