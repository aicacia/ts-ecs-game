import { CtxRendererPlugin } from "./CtxRendererPlugin";
import { Renderer } from "./Renderer";

export class CtxRenderer extends Renderer {
  static rendererName = "engine.CtxRenderer";
  static rendererPriority = 0;

  private ctx: CanvasRenderingContext2D = null as any;

  getCtx() {
    return this.ctx;
  }
  getScale() {
    return this.getRendererPlugin<CtxRendererPlugin>()
      .unwrap()
      .getScale();
  }
  getInvScale() {
    return this.getRendererPlugin<CtxRendererPlugin>()
      .unwrap()
      .getInvScale();
  }

  onAdd() {
    this.ctx = this.getRendererPlugin<CtxRendererPlugin>()
      .unwrap()
      .getCtx();
    return this;
  }
  onRemove() {
    this.ctx = null as any;
    return this;
  }
}
