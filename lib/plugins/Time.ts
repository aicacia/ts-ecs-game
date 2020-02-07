import { EPSILON } from "../math";
import { Plugin } from "../sceneGraph";

export class Time extends Plugin {
  static pluginName = "engine.Time";
  static pluginPriority = -Infinity;

  private scale: number = 1.0;

  private globalFixed: number = 1.0 / 60.0;
  private fixedDelta: number = 1.0 / 60.0;

  private frame: number = 0;
  private last: number = -(1.0 / 60.0);
  private current: number = 0.0;
  private delta: number = 1.0 / 60.0;
  private fps: number = 60.0;
  private fpsFrame: number = 0;
  private fpsLast: number = 0;

  private startTime: number = Date.now() * 0.001;
  private minDelta: number = EPSILON;
  private maxDelta: number = Infinity;

  getStartTime() {
    return this.startTime;
  }

  getDelta() {
    return this.delta;
  }

  getCurrent() {
    return this.current;
  }

  getMinDelta() {
    return this.minDelta;
  }
  setMinDelta(minDelta: number) {
    this.minDelta = minDelta;
    return this;
  }

  getMaxDelta() {
    return this.maxDelta;
  }
  setMaxDelta(maxDelta: number) {
    this.maxDelta = maxDelta;
    return this;
  }

  getFrame() {
    return this.frame;
  }
  getFps() {
    return this.fps;
  }

  getScale() {
    return this.scale;
  }
  setScale(scale: number) {
    this.scale = scale;
    this.fixedDelta = this.globalFixed * scale;
    return this;
  }

  getFixedDelta() {
    return this.fixedDelta;
  }
  setFixedDelta(fixedDelta: number) {
    this.globalFixed = fixedDelta;
    this.fixedDelta = this.globalFixed * this.scale;
    return this;
  }

  now() {
    return Date.now() * 0.001 - this.startTime;
  }

  onUpdate() {
    ++this.frame;

    this.last = this.current;
    this.current = this.now();

    this.fpsFrame++;
    if (this.fpsLast + 1 < this.current) {
      this.fps = this.fpsFrame / (this.current - this.fpsLast);

      this.fpsLast = this.current;
      this.fpsFrame = 0;
    }

    this.delta = (this.current - this.last) * this.scale;
    this.delta =
      this.delta < this.minDelta
        ? this.minDelta
        : this.delta > this.maxDelta
        ? this.maxDelta
        : this.delta;

    return this;
  }
}
