import { Plugin } from "../sceneGraph";
import { Canvas } from "../utils";

export class FullScreenCanvas extends Plugin {
  static pluginName = "engine.FullScreenCanvas";

  private canvas: Canvas;
  private window: Window;

  constructor(canvas: Canvas) {
    super();

    this.canvas = canvas;

    const style = canvas.getElement().style;

    style.position = "absolute";
    style.top = "0px";
    style.left = "0px";

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
    this.window.addEventListener("orientationchange", this.onResize);
    this.window.addEventListener("resize", this.onResize);
    this.onResize();
    return this;
  }

  onResize = () => {
    const width = this.window.innerWidth,
      height = this.window.innerHeight;

    this.canvas.set(width, height);

    this.emit("resize");
  };
}
