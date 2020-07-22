import { Plugin } from "../../sceneGraph";

export abstract class Renderer extends Plugin {
  static pluginPriority = Infinity;

  private rendererHandlers: RendererHandler[] = [];
  private rendererHandlerMap: Map<
    IConstructor<RendererHandler>,
    RendererHandler
  > = new Map();

  getRendererHandlers() {
    return this.rendererHandlers;
  }
  getRendererHandler<R extends RendererHandler>(
    RendererHandler: IConstructor<R>
  ) {
    return Option.from(this.rendererHandlerMap.get(RendererHandler));
  }

  addRendererHandlers(...rendererHandlers: RendererHandler[]) {
    rendererHandlers.forEach((rendererHandler) =>
      this._addRendererHandler(rendererHandler)
    );
    return this;
  }
  addRendererHandler(...rendererHandlers: RendererHandler[]) {
    return this.addRendererHandlers(...rendererHandlers);
  }

  removeRendererHandlers(...rendererHandlers: IConstructor<RendererHandler>[]) {
    rendererHandlers.forEach((rendererHandler) =>
      this._removeRendererHandler(rendererHandler)
    );
    this.sort();
    return this;
  }
  removeRendererHandler(...rendererHandlers: IConstructor<RendererHandler>[]) {
    return this.removeRendererHandlers(...rendererHandlers);
  }

  onUpdate() {
    this.rendererHandlers.forEach((rendererHandler) => {
      if (rendererHandler.getEnabled()) {
        rendererHandler.onBeforeRender();
        rendererHandler.onRender();
      }
    });
    return this;
  }
  onAfterUpdate() {
    this.rendererHandlers.forEach((rendererHandler) => {
      if (rendererHandler.getEnabled()) {
        rendererHandler.onAfterRender();
      }
    });
    return this;
  }

  private _addRendererHandler<R extends RendererHandler = RendererHandler>(
    rendererHandler: R
  ) {
    const RendererHandler = rendererHandler.getConstructor();

    if (!this.rendererHandlerMap.has(RendererHandler)) {
      this.rendererHandlers.push(rendererHandler);
      this.rendererHandlerMap.set(RendererHandler, rendererHandler);
      rendererHandler.UNSAFE_setRenderer(this);
      rendererHandler.onAdd();
      this.emit("add-renderer_handler", rendererHandler);
    }

    return this;
  }
  private _removeRendererHandler<R extends RendererHandler = RendererHandler>(
    RendererHandler: IConstructor<R>
  ) {
    this.getRendererHandler(RendererHandler).ifSome((rendererHandler) => {
      this.emit("remove-renderer_handler", rendererHandler);
      rendererHandler.onRemove();

      this.rendererHandlers.splice(
        this.rendererHandlers.indexOf(rendererHandler),
        1
      );
      this.rendererHandlerMap.delete(RendererHandler);
      rendererHandler.UNSAFE_removeRenderer();
    });

    return this;
  }

  private sort() {
    this.rendererHandlers.sort(this.sortFunction);
  }
  private sortFunction(a: RendererHandler, b: RendererHandler) {
    return a.getRendererHandlerPriority() - b.getRendererHandlerPriority();
  }
}

import { Option } from "@aicacia/core";
import { IConstructor } from "../../utils";
import { RendererHandler } from "./RendererHandler";