import { mat2d } from "gl-matrix";
import {
  AngleCtxRendererHandler,
  Camera2DManager,
  GridCtxRendererHandler,
  LineCtxRendererHandler,
  PointCtxRendererHandler
} from "../../components";
import { Canvas } from "../../utils";
import { toRgb } from "../../utils/math";
import { Renderer } from "./Renderer";

const MAT2D_0 = mat2d.create();

export class CtxRenderer extends Renderer {
  static pluginName = "engine.CtxRenderer";

  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;
  private lineWidth: number = 1.0;

  constructor(canvas: Canvas) {
    super();
    this.canvas = canvas;

    const ctx = canvas.getElement().getContext("2d");
    if (!ctx) {
      throw new TypeError("Could not get context of canvas element");
    }
    this.ctx = ctx;

    this.addRendererHandler(
      new PointCtxRendererHandler(),
      new LineCtxRendererHandler(),
      new AngleCtxRendererHandler(),
      new GridCtxRendererHandler()
    );
  }

  getCanvas() {
    return this.canvas;
  }
  getCtx() {
    return this.ctx;
  }

  getLineWidth() {
    return this.lineWidth;
  }
  setLineWidth(lineWidth: number) {
    this.lineWidth = lineWidth;
    return this;
  }

  getCamera() {
    return this.getScene()
      .flatMap(scene =>
        scene
          .getManager(Camera2DManager)
          .flatMap(manager => manager.getActive())
      )
      .expect("Scene should have an active Camera");
  }

  getCanvasSize() {
    const width = this.canvas.getWidth(),
      height = this.canvas.getHeight();

    return (width > height ? height : width) * 0.5;
  }
  getScale() {
    return (
      (1.0 / this.getCanvasSize()) * this.getCamera().getOrthographicSize()
    );
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
  }

  onUpdate() {
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
