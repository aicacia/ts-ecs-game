import { Plugin } from "../sceneGraph";
import { Canvas } from "../utils";

// tslint:disable-next-line: interface-name
export interface FullScreenCanvas {
  on(event: "emit", listener: () => void): this;
}

export class FullScreenCanvas extends Plugin {
  private canvas: Canvas;
  private window: Window;

  constructor(canvas: Canvas) {
    super();

    this.canvas = canvas;

    const document = this.canvas.getElement().ownerDocument,
      window = document?.defaultView;

    if (window) {
      this.window = window;
    } else {
      throw new Error("failed to window object from canvas element");
    }
  }

  getCanvas() {
    return this.canvas;
  }

  onAdd() {
    const style = this.canvas.getElement().style;

    style.position = "absolute";
    style.top = "0px";
    style.left = "0px";

    this.window.addEventListener("orientationchange", this.onResize);
    this.window.addEventListener("resize", this.onResize);
    this.onResize();
    return this;
  }

  onRemove() {
    this.window.removeEventListener("orientationchange", this.onResize);
    this.window.removeEventListener("resize", this.onResize);
    return this;
  }

  onResize = () => {
    const width = this.window.innerWidth,
      height = this.window.innerHeight;

    this.canvas.set(width, height);

    this.emit("resize");
  };
}
