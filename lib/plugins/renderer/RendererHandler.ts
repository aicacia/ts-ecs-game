import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class RendererHandler extends EventEmitter {
  static rendererHandlerName: string;
  static rendererHandlerPriority: number;

  static getRendererHandlerName() {
    if (!this.rendererHandlerName) {
      throw new Error(
        "Invalid rendererHandlerName for RendererHandler `" +
          this.rendererHandlerName +
          "` " +
          this
      );
    }
    return this.rendererHandlerName;
  }
  static getRendererHandlerPriority() {
    return this.rendererHandlerPriority;
  }

  private renderer: Option<Renderer> = none();

  getRendererHandlerName(): string {
    return Object.getPrototypeOf(this).constructor.getRendererHandlerName();
  }
  getRendererHandlerPriority(): number {
    return Object.getPrototypeOf(this).constructor.getRendererHandlerPriority();
  }

  UNSAFE_setRenderer(renderer: Renderer) {
    this.renderer = some(renderer);
    return this;
  }
  UNSAFE_removeRenderer() {
    this.renderer = none();
    return this;
  }
  getRenderer<T extends Renderer = Renderer>() {
    return this.renderer as Option<T>;
  }
  getRequiredRenderer<T extends Renderer = Renderer>() {
    return this.renderer.expect(
      `${this.getRendererHandlerName()} expected to be added to a Renderer first`
    ) as T;
  }

  getScene() {
    return this.getRenderer().flatMap(renderer => renderer.getScene());
  }
  getRequiredScene() {
    return this.getScene().expect(
      `${this.getRendererHandlerName()} required scene`
    );
  }

  getPlugin<P extends Plugin>(Plugin: new (...args: any[]) => P) {
    return this.getScene().flatMap(scene => scene.getPlugin(Plugin));
  }
  getRequiredPlugin<P extends Plugin>(Plugin: new (...args: any[]) => P) {
    return this.getPlugin(Plugin).expect(
      `${this.getRendererHandlerName()} required ${(Plugin as any).getPluginName()} Plugin`
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

import { Plugin } from "../../sceneGraph";
import { Renderer } from "./Renderer";
