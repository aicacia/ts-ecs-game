import { Plugin } from "../sceneGraph";

export class Control extends Plugin {
  static pluginName = "engine.Control";

  private paused: boolean = false;

  isPaused() {
    return this.paused;
  }

  play() {
    this.paused = false;
    return this;
  }
  pause() {
    this.paused = true;
    return this;
  }
}
