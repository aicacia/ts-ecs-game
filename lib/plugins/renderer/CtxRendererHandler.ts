import { CtxRenderer } from "./CtxRenderer";
import { RendererHandler } from "./RendererHandler";

export class CtxRendererHandler extends RendererHandler {
  static rendererName = "engine.CtxRendererHandler";
  static rendererPriority = 0;

  private ctx: CanvasRenderingContext2D = null as any;

  getCtx() {
    return this.ctx;
  }
  getCamera() {
    return this.getRenderer<CtxRenderer>()
      .map(renderer => renderer.getCamera())
      .unwrap();
  }
  getScale() {
    return this.getRenderer<CtxRenderer>()
      .map(renderer => renderer.getScale())
      .unwrap();
  }

  onAdd() {
    this.ctx = this.getRenderer<CtxRenderer>()
      .unwrap()
      .getCtx();
    return this;
  }
  onRemove() {
    this.ctx = null as any;
    return this;
  }
}
