import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class RendererHandler<
  R extends Renderer = Renderer
> extends EventEmitter {
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

  private renderer: Option<R> = none();
  private enabled: boolean = true;

  getEnabled() {
    return this.enabled;
  }
  setEnabled(enabled: boolean = true) {
    this.enabled = enabled;
    return this;
  }

  getRendererHandlerName(): string {
    return Object.getPrototypeOf(this).constructor.getRendererHandlerName();
  }
  getRendererHandlerPriority(): number {
    return Object.getPrototypeOf(this).constructor.getRendererHandlerPriority();
  }

  UNSAFE_setRenderer(renderer: R) {
    this.renderer = some(renderer);
    return this;
  }
  UNSAFE_removeRenderer() {
    this.renderer = none();
    return this;
  }
  getRenderer() {
    return this.renderer;
  }
  getRequiredRenderer() {
    return this.renderer.expect(
      `${this.getRendererHandlerName()} expected to be added to a Renderer first`
    );
  }

  getScene() {
    return this.getRenderer().flatMap(renderer => renderer.getScene());
  }
  getRequiredScene() {
    return this.getScene().expect(
      `${this.getRendererHandlerName()} required scene`
    );
  }

  getManager<M extends Manager>(Manager: IConstructor<M>) {
    return this.getScene().flatMap(scene => scene.getManager(Manager));
  }
  getRequiredManager<M extends Manager>(Manager: IConstructor<M>) {
    return this.getManager(Manager).expect(
      `${this.getRendererHandlerName()} required ${(Manager as any).getManagerName()} Manager`
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

import { Manager, Plugin } from "../../sceneGraph";
import { IConstructor } from "../../utils";
import { Renderer } from "./Renderer";
