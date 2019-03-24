import { EventEmitter } from "events";

export interface ICanvasOptions {
  disableContextMenu?: boolean;
}

export class Canvas extends EventEmitter {
  private canvas: HTMLCanvasElement;
  private width: number = 1;
  private height: number = 1;

  constructor(options: ICanvasOptions = {}) {
    super();

    this.canvas = document.createElement("canvas");

    if (options.disableContextMenu === true) {
      this.canvas.oncontextmenu = () => false;
    }
  }

  getElement() {
    return this.canvas;
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }

  set(width: number, height: number) {
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;

      this.canvas.width = this.width;
      this.canvas.height = this.height;

      this.canvas.style.width = this.width + "px";
      this.canvas.style.height = this.height + "px";

      this.emit("resize");
    }
    return this;
  }

  getImageURI() {
    return this.canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
  }
}
