import { none, Option, some, IConstructor } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class Plugin extends EventEmitter {
  static pluginPriority = 0;
  static requiredPlugins: IRequirement<Plugin>[] = [];

  static getPluginPriority() {
    return this.pluginPriority;
  }
  static getRequiredPlugins(): IRequirement<Plugin>[] {
    return this.requiredPlugins;
  }

  private scene: Option<Scene> = none();

  getConstructor(): IConstructor<this> {
    return Object.getPrototypeOf(this).constructor;
  }
  getPluginPriority(): number {
    return Object.getPrototypeOf(this).constructor.getPluginPriority();
  }
  getRequiredPlugins(): IConstructor<Plugin>[] {
    return Object.getPrototypeOf(this).constructor.requiredPlugins;
  }

  getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): Option<P> {
    return this.getScene().flatMap((scene) => scene.getPlugin(Plugin));
  }
  getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).expect(
      `${this.getConstructor()} required ${Plugin} Plugin`
    );
  }

  getManager<M extends Manager = Manager>(Manager: IConstructor<M>): Option<M> {
    return this.getScene().flatMap((scene) => scene.getManager(Manager));
  }
  getRequiredManager<M extends Manager = Manager>(Manager: IConstructor<M>) {
    return this.getManager(Manager).expect(
      `${this.getConstructor()} required ${Manager} Manager`
    );
  }

  validateRequirements() {
    const missingPlugins: IConstructor<Plugin>[] = [];

    for (const plugin of this.getRequiredScene().getPlugins()) {
      filterRequirements(
        missingPlugins,
        plugin.getRequiredPlugins(),
        (P) => !this.getRequiredScene().hasPlugin(P)
      );
    }

    if (missingPlugins.length > 0) {
      const pluginMessage = missingPlugins.map(
        (missingRequirement) =>
          `${this.getConstructor()} Plugin requires ${requirementToString(
            missingRequirement
          )} Plugin`
      );
      throw new Error(pluginMessage.join("\n"));
    }
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
    return this.getScene().expect(`${this.getConstructor()} required a Scene`);
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

import {
  IRequirement,
  filterRequirements,
  requirementToString,
} from "./IRequirement";
import { Manager } from "./Manager";
import { Scene } from "./Scene";