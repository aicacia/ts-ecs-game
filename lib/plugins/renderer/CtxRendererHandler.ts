import { CtxRenderer } from "./CtxRenderer";
import { RendererHandler } from "./RendererHandler";

export class CtxRendererHandler extends RendererHandler<CtxRenderer> {
  static rendererHandlerName = "engine.CtxRendererHandler";
  static rendererHandlerPriority = 0;

  getCtx() {
    return this.getRequiredRenderer().getCtx();
  }
  getCamera() {
    return this.getRenderer()
      .map(renderer => renderer.getCamera())
      .unwrap();
  }
  getScale() {
    return this.getRenderer()
      .map(renderer => renderer.getScale())
      .unwrap();
  }
}
