import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class Renderer extends EventEmitter {
  static rendererName: string;
  static rendererPriority: number;

  static getRendererName() {
    return this.rendererName;
  }
  static getRendererPriority() {
    return this.rendererPriority;
  }

  private rendererPlugin: Option<RendererPlugin> = none();

  getRendererName(): string {
    return Object.getPrototypeOf(this).constructor.getRendererName();
  }
  getRendererPriority(): number {
    return Object.getPrototypeOf(this).constructor.getRendererPriority();
  }

  UNSAFE_setRendererPlugin(rendererPlugin: RendererPlugin) {
    this.rendererPlugin = some(rendererPlugin);
    return this;
  }
  UNSAFE_removeRendererPlugin() {
    this.rendererPlugin = none();
    return this;
  }
  getRendererPlugin<T extends RendererPlugin = RendererPlugin>() {
    return this.rendererPlugin as Option<T>;
  }

  getScene() {
    return this.getRendererPlugin().flatMap(rendererPlugin =>
      rendererPlugin.getScene()
    );
  }

  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }
  onBeforeRender() {
    return this;
  }
  onRender() {
    return this;
  }
  onAfterRender() {
    return this;
  }
}

import { RendererPlugin } from "./RendererPlugin";
