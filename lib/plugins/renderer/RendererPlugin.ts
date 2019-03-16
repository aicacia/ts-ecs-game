import { Plugin } from "../../sceneGraph";

export abstract class RendererPlugin extends Plugin {
  static pluginName = "engine.RendererPlugin";
  static pluginPriority = Infinity;

  private renderers: Renderer[] = [];
  private rendererMap: Record<string, Renderer> = {};

  getRenderers() {
    return this.renderers;
  }
  getRenderer<T extends Renderer>(Renderer: new (...args: any[]) => T) {
    return this.rendererMap[(Renderer as any).getRendererName()];
  }

  addRenderers(...renderers: Renderer[]) {
    renderers.forEach(renderer => this._addRenderer(renderer));
    return this;
  }
  addRenderer(...renderers: Renderer[]) {
    return this.addRenderers(...renderers);
  }

  removeRenderers(...renderers: Array<new () => Renderer>) {
    renderers.forEach(renderer => this._removeRenderer(renderer));
    this.sort();
    return this;
  }
  removeRenderer(...renderers: Array<new () => Renderer>) {
    return this.removeRenderers(...renderers);
  }

  onUpdate() {
    this.renderers.forEach(renderer => {
      renderer.onBeforeRender();
      renderer.onRender();
    });
    return this;
  }
  onAfterUpdate() {
    this.renderers.forEach(renderer => renderer.onAfterRender());
    return this;
  }

  private _addRenderer<T extends Renderer>(renderer: T) {
    const rendererName = renderer.getRendererName();

    if (!this.rendererMap[rendererName]) {
      this.renderers.push(renderer);
      this.rendererMap[rendererName] = renderer;
      renderer.UNSAFE_setRendererPlugin(this);
      renderer.onAdd();
      this.emit("add-renderer", renderer);
    }

    return this;
  }
  private _removeRenderer<T extends Renderer>(Renderer: new () => T) {
    const rendererName = (Renderer as any).getRendererName(),
      renderer = this.rendererMap[rendererName];

    if (renderer) {
      renderer.onRemove();
      this.emit("remove-renderer", renderer);

      this.renderers.splice(this.renderers.indexOf(renderer), 1);
      delete this.rendererMap[rendererName];
      renderer.UNSAFE_removeRendererPlugin();
    }

    return this;
  }

  private sort() {
    this.renderers.sort(this.sortFunction);
  }
  private sortFunction(a: Renderer, b: Renderer) {
    return a.getRendererPriority() - b.getRendererPriority();
  }
}

import { Renderer } from "./Renderer";
