import { mat2d } from "gl-matrix";
import {
  Camera2DManager,
  LineCtxRenderer,
  PointCtxRenderer
} from "../../components";
import { Canvas } from "../../utils";
import { RendererPlugin } from "./RendererPlugin";

const MAT2D_0 = mat2d.create();

export class CtxRendererPlugin extends RendererPlugin {
  static pluginName = "engine.CtxRendererPlugin";

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

    this.addRenderer(new PointCtxRenderer(), new LineCtxRenderer());
  }

  getCanvas() {
    return this.canvas;
  }
  getCtx() {
    return this.ctx;
  }
  getScale() {
    const width = this.canvas.getWidth(),
      height = this.canvas.getHeight();

    return (width > height ? height : width) * 0.5;
  }
  getInvScale() {
    return 1.0 / this.getScale()
  }

  getCamera() {
    return this.getScene().flatMap(scene =>
      scene.getManager(Camera2DManager).flatMap(manager => manager.getActive())
    );
  }

  render(fn: (ctx: CanvasRenderingContext2D) => void) {
    this.ctx.save();

    this.ctx.translate(
      this.canvas.getWidth() * 0.5,
      this.canvas.getHeight() * 0.5
    );
    const scale = this.getScale();
    this.ctx.scale(scale, -scale);

    this.getCamera().map(camera => {
      mat2d.mul(MAT2D_0, camera.getProjection(), camera.getView());
      this.ctx.transform(
        MAT2D_0[0],
        MAT2D_0[2],
        MAT2D_0[1],
        MAT2D_0[3],
        MAT2D_0[4],
        MAT2D_0[5]
      );
    });
    fn(this.ctx);
    this.ctx.restore();
  }

  renderModel(model: mat2d, fn: (ctx: CanvasRenderingContext2D) => void) {
    this.ctx.save();

    this.ctx.translate(
      this.canvas.getWidth() * 0.5,
      this.canvas.getHeight() * 0.5
    );
    const scale = this.getScale();
    this.ctx.scale(scale, -scale);

    this.getCamera().map(camera => {
      mat2d.mul(MAT2D_0, camera.getProjection(), camera.getView());
      mat2d.mul(MAT2D_0, MAT2D_0, model);
      this.ctx.transform(
        MAT2D_0[0],
        MAT2D_0[2],
        MAT2D_0[1],
        MAT2D_0[3],
        MAT2D_0[4],
        MAT2D_0[5]
      );
    });
    fn(this.ctx);
    this.ctx.restore();
  }

  onUpdate() {
      this.ctx.save();
      this.ctx.lineWidth = this.getInvScale();
    this.getCamera().map(camera => {
      const bg = camera.getBackground();

      this.ctx.save();
      this.ctx.fillStyle =
        "rgba(" +
        bg[0] * 256 +
        ", " +
        bg[1] * 256 +
        ", " +
        bg[2] * 256 +
        ", " +
        bg[3] +
        ")";
      this.ctx.fillRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
      this.ctx.restore();
    });
    super.onUpdate();
      this.ctx.restore();
    return this;
  }
}
