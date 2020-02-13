import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class Plugin extends EventEmitter {
  static pluginName: string;
  static pluginPriority: number = 0;

  static getPluginName() {
    if (!this.pluginName) {
      throw new Error(
        "Invalid pluginName for Plugin `" + this.pluginName + "` " + this
      );
    }
    return this.pluginName;
  }
  static getPluginPriority() {
    return this.pluginPriority;
  }

  private scene: Option<Scene> = none();

  getPluginName(): string {
    return Object.getPrototypeOf(this).constructor.getPluginName();
  }
  getPluginPriority(): number {
    return Object.getPrototypeOf(this).constructor.getPluginPriority();
  }

  getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): Option<P> {
    return this.getScene().flatMap(scene => scene.getPlugin(Plugin));
  }
  getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).expect(
      `${this.getPluginName()} required ${(Plugin as any).getPluginName()} Plugin`
    );
  }

  getManager<M extends Manager = Manager>(Manager: IConstructor<M>): Option<M> {
    return this.getScene().flatMap(scene => scene.getManager(Manager));
  }
  getRequiredManager<M extends Manager = Manager>(Manager: IConstructor<M>) {
    return this.getManager(Manager).expect(
      `${this.getPluginName()} required ${(Manager as any).getManagerName()} Manager`
    );
  }

  UNSAFE_setScene(scene: Scene) {
    this.scene = some(scene);
    return this;
  }
  UNSAFE_removeScene() {
    this.scene = none();
    return this;
  }
  getScene() {
    return this.scene;
  }
  getRequiredScene() {
    return this.getScene().expect(`${this.getPluginName()} required a Scene`);
  }

  onInit() {
    return this;
  }
  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }
  onAfterUpdate() {
    return this;
  }
  onUpdate() {
    return this;
  }
}

import { IConstructor } from "../utils";
import { Manager } from "./Manager";
import { Scene } from "./Scene";
