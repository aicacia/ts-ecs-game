import { Plugin } from "../../sceneGraph";

export abstract class Renderer extends Plugin {
  static pluginName = "engine.Renderer";
  static pluginPriority = Infinity;

  private rendererHandlers: RendererHandler[] = [];
  private rendererHandlerMap: Record<string, RendererHandler> = {};

  getRendererHandlers() {
    return this.rendererHandlers;
  }
  getRendererHandler<T extends RendererHandler>(
    RendererHandler: IConstructor<T>
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
      rendererHandler.onBeforeRender();
      rendererHandler.onRender();
    });
    return this;
  }
  onAfterUpdate() {
    this.rendererHandlers.forEach(rendererHandler =>
      rendererHandler.onAfterRender()
    );
    return this;
  }

  private _addRendererHandler<T extends RendererHandler>(rendererHandler: T) {
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
  private _removeRendererHandler<T extends RendererHandler>(
    RendererHandler: new () => T
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
