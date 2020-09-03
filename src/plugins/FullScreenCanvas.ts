import { Canvas } from "../utils";
import { RunOnUpdatePlugin } from "./RunOnUpdatePlugin";
import { Input } from "./input";
import { IRequirement, Plugin } from "../sceneGraph";

// tslint:disable-next-line: interface-name
export interface FullScreenCanvas {
  on(event: "emit", listener: () => void): this;
}

export class FullScreenCanvas extends RunOnUpdatePlugin {
  static requiredPlugins: IRequirement<Plugin>[] = [Input];

  private canvas: Canvas;

  constructor(canvas: Canvas) {
    super();

    this.canvas = canvas;
  }

  getCanvas() {
    return this.canvas;
  }

  onAdd() {
    this.getRequiredPlugin(Input).on("resize", this.onResize);
    return this;
  }

  onRemove() {
    this.getRequiredPlugin(Input).off("resize", this.onResize);
    return this;
  }

  private onResize = () => {
    this.enqueue(this.runOnResizeFn);
  };

  private runOnResizeFn = () => {
    const input = this.getRequiredPlugin(Input);
    this.canvas.set(input.getValue("width"), input.getValue("height"));
  };
}
