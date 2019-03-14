import { none, Option, some } from "@aicacia/core";

export abstract class Plugin {
  static pluginName: string;

  static getPluginName(): string {
    return this.pluginName;
  }

  protected scene: Option<Scene> = none();
  protected manager: Option<Manager> = none();

  getPluginName(): string {
    return Object.getPrototypeOf(this).constructor.getPluginName();
  }

  setScene(scene: Scene) {
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

import { Manager } from "./Manager";
import { Scene } from "./Scene";
