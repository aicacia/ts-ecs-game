import { mat2d } from "gl-matrix";
import {
  AngleCtxRendererHandler,
  Camera2D,
  Camera2DManager,
  LineCtxRendererHandler,
  PointCtxRendererHandler
} from "../../components";
import { Canvas } from "../../utils";
import { toRgba } from "../../utils/math";
import { Renderer } from "./Renderer";

const MAT2D_0 = mat2d.create();

export class CtxRenderer extends Renderer {
  static pluginName = "engine.CtxRenderer";

  private canvas: Canvas;
  private ctx: CanvasRenderingContext2D;

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
      new AngleCtxRendererHandler()
    );
  }

  getCanvas() {
    return this.canvas;
  }
  getCtx() {
    return this.ctx;
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

  getCamera() {
    return this.getScene()
      .flatMap(scene =>
        scene
          .getManager(Camera2DManager)
          .flatMap(manager => manager.getActive())
      )
      .expect("Scene should have an active Camera");
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
      scale = this.getCanvasSize();

    this.ctx.save();

    const bg = camera.getBackground();

    this.ctx.save();
    this.ctx.fillStyle = toRgba(bg);
    this.ctx.fillRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
    this.ctx.restore();

    this.ctx.lineWidth = this.getScale() * 2.0;
    this.ctx.translate(
      this.canvas.getWidth() * 0.5,
      this.canvas.getHeight() * 0.5
    );
    this.ctx.scale(scale, -scale);

    super.onUpdate();
    this.ctx.restore();

    return this;
  }
}
