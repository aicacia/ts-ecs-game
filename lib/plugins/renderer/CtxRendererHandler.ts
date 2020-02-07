import { CtxRenderer } from "./CtxRenderer";
import { RendererHandler } from "./RendererHandler";

export class CtxRendererHandler extends RendererHandler<CtxRenderer> {
  static rendererHandlerName = "engine.CtxRendererHandler";
  static rendererHandlerPriority = 0;

  getCtx() {
    return this.getRequiredRenderer().getCtx();
  }
  getCamera() {
    return this.getRequiredRenderer().getCamera();
  }
  getScale() {
    return this.getRequiredRenderer().getScale();
  }
}
