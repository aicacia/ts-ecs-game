import { none, Option } from "@aicacia/core";
import { mat2d } from "gl-matrix";
import { Camera2D, Camera2DManager } from "../../components";
import { toRgb } from "../../math";
import { Canvas } from "../../utils/Canvas";
import { Renderer } from "./Renderer";

const MAT2D_0 = mat2d.create();

export class CtxRenderer extends Renderer {
  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;
  private lineWidth: number = 1.0;
  private camera: Option<Camera2D> = none();
  private enabled: boolean = true;

  constructor(canvas: Canvas) {
    super();
    this.canvas = canvas;

    const ctx = canvas.getElement().getContext("2d");
    if (!ctx) {
      throw new Error("Could not get context of canvas element");
    }
    this.ctx = ctx;
  }

  getCanvas() {
    return this.canvas;
  }
  getCtx() {
    return this.ctx;
  }

  getEnabled() {
    return this.enabled;
  }
  setEnabled(enabled: boolean = true) {
    this.enabled = enabled;
    return this;
  }

  getLineWidth() {
    return this.lineWidth;
  }
  setLineWidth(lineWidth: number) {
    this.lineWidth = lineWidth;
    return this;
  }

  getActiveCamera = () => {
    return this.getRequiredScene()
      .getRequiredManager(Camera2DManager)
      .getRequiredActive();
  };
  getCamera() {
    return this.camera.unwrapOrElse(this.getActiveCamera);
  }
  setCamera(camera: Camera2D) {
    this.camera.replace(camera);
    return this;
  }
  removeCamera() {
    this.camera.take();
    return this;
  }

  getCanvasSize() {
    const width = this.canvas.getWidth(),
      height = this.canvas.getHeight();

    return (width > height ? height : width) * 0.5;
  }
  getScale() {
    return (1.0 / this.getCanvasSize()) * this.getCamera().getSize();
  }

  render(fn: (ctx: CanvasRenderingContext2D) => void, model?: mat2d) {
    const camera = this.getCamera();

    this.ctx.save();
    mat2d.mul(MAT2D_0, camera.getProjection(), camera.getView());
    if (model) {
      mat2d.mul(MAT2D_0, MAT2D_0, model);
    }
    this.ctx.transform(
      MAT2D_0[0],
      MAT2D_0[1],
      MAT2D_0[2],
      MAT2D_0[3],
      MAT2D_0[4],
      MAT2D_0[5]
    );
    fn(this.ctx);
    this.ctx.restore();
    return this;
  }

  onUpdate() {
    if (!this.enabled) {
      return this;
    }
    const camera = this.getCamera(),
      width = this.canvas.getWidth(),
      height = this.canvas.getHeight(),
      halfWidth = width * 0.5,
      halfHeight = height * 0.5;

    camera.set(width, height);

    this.ctx.save();

    this.ctx.save();
    this.ctx.fillStyle = toRgb(camera.getBackground());
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();

    this.ctx.lineWidth = this.getLineWidth() * this.getScale();
    this.ctx.translate(halfWidth, halfHeight);
    this.ctx.scale(halfWidth, -halfHeight);

    super.onUpdate();
    this.ctx.restore();

    return this;
  }
}
