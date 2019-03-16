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

  UNSAFE_setRendererSystem(rendererPlugin: RendererPlugin) {
    this.rendererPlugin = some(rendererPlugin);
    return this;
  }
  UNSAFE_removeRendererSystem() {
    this.rendererPlugin = none();
    return this;
  }
  getRendererSystem() {
    return this.rendererPlugin;
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
