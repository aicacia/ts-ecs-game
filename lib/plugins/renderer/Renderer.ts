import { Plugin } from "../../sceneGraph";

export abstract class Renderer extends Plugin {
  static pluginName = "engine.Renderer";
  static pluginPriority = Infinity;

  private rendererHandlers: RendererHandler[] = [];
  private rendererHandlerMap: Record<string, RendererHandler> = {};

  getRendererHandlers() {
    return this.rendererHandlers;
  }
  getRendererHandler<R extends RendererHandler>(
    RendererHandler: IConstructor<R>
  ) {
    return this.rendererHandlerMap[(RendererHandler as any).getRendererName()];
  }

  addRendererHandlers(...rendererHandlers: RendererHandler[]) {
    rendererHandlers.forEach(rendererHandler =>
      this._addRendererHandler(rendererHandler)
    );
    return this;
  }
  addRendererHandler(...rendererHandlers: RendererHandler[]) {
    return this.addRendererHandlers(...rendererHandlers);
  }

  removeRendererHandlers(
    ...rendererHandlers: Array<new () => RendererHandler>
  ) {
    rendererHandlers.forEach(rendererHandler =>
      this._removeRendererHandler(rendererHandler)
    );
    this.sort();
    return this;
  }
  removeRendererHandler(...rendererHandlers: Array<new () => RendererHandler>) {
    return this.removeRendererHandlers(...rendererHandlers);
  }

  onUpdate() {
    this.rendererHandlers.forEach(rendererHandler => {
      if (rendererHandler.getEnabled()) {
        rendererHandler.onBeforeRender();
        rendererHandler.onRender();
      }
    });
    return this;
  }
  onAfterUpdate() {
    this.rendererHandlers.forEach(rendererHandler => {
      if (rendererHandler.getEnabled()) {
        rendererHandler.onAfterRender();
      }
    });
    return this;
  }

  private _addRendererHandler<R extends RendererHandler>(rendererHandler: R) {
    const rendererHandlerName = rendererHandler.getRendererHandlerName();

    if (!this.rendererHandlerMap[rendererHandlerName]) {
      this.rendererHandlers.push(rendererHandler);
      this.rendererHandlerMap[rendererHandlerName] = rendererHandler;
      rendererHandler.UNSAFE_setRenderer(this);
      rendererHandler.onAdd();
      this.emit("add-renderer_handler", rendererHandler);
    }

    return this;
  }
  private _removeRendererHandler<R extends RendererHandler>(
    RendererHandler: new () => R
  ) {
    const rendererHandlerName = (RendererHandler as any).getRendererName(),
      rendererHandler = this.rendererHandlerMap[rendererHandlerName];

    if (rendererHandler) {
      this.emit("remove-renderer_handler", rendererHandler);
      rendererHandler.onRemove();

      this.rendererHandlers.splice(
        this.rendererHandlers.indexOf(rendererHandler),
        1
      );
      delete this.rendererHandlerMap[rendererHandlerName];
      rendererHandler.UNSAFE_removeRenderer();
    }

    return this;
  }

  private sort() {
    this.rendererHandlers.sort(this.sortFunction);
  }
  private sortFunction(a: RendererHandler, b: RendererHandler) {
    return a.getRendererHandlerPriority() - b.getRendererHandlerPriority();
  }
}

import { IConstructor } from "../../utils";
import { RendererHandler } from "./RendererHandler";
