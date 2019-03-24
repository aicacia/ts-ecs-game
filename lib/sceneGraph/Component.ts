import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class Component extends EventEmitter {
  static Manager: new () => Manager;
  static componentName: string;

  static getComponentName(): string {
    if (!this.componentName) {
      throw new Error(
        "Invalid componentName for Component `" +
          this.componentName +
          "` " +
          this
      );
    }
    return this.componentName;
  }
  static getManagerConstructor(): new () => Manager {
    if (!this.Manager) {
      throw new Error(
        this.getComponentName() +
          " invalid Manager `" +
          this.Manager +
          "` " +
          this
      );
    }
    return this.Manager;
  }

  private entity: Option<Entity> = none();
  private manager: Option<Manager> = none();

  getComponentName(): string {
    return Object.getPrototypeOf(this).constructor.getComponentName();
  }
  getManagerConstructor<M extends Manager = Manager>(): new () => M {
    return Object.getPrototypeOf(this).constructor.getManagerConstructor();
  }

  getComponent<T extends Component = Component>(
    Component: new (...args: any[]) => T
  ) {
    return this.getEntity().flatMap(entity => entity.getComponent(Component));
  }
  getPlugin<T extends Plugin = Plugin>(Plugin: new (...args: any[]) => T) {
    return this.getScene().flatMap(scene => scene.getPlugin(Plugin));
  }

  UNSAFE_setEntity(entity: Entity) {
    this.entity = some(entity);
    return this;
  }
  UNSAFE_removeEntity() {
    this.entity = none();
    return this;
  }
  getEntity() {
    return this.entity;
  }
  getScene() {
    return this.entity.flatMap(entity => entity.getScene());
  }

  UNSAFE_setManager<M extends Manager = Manager>(manager: M) {
    this.manager = some(manager);
    return this;
  }
  UNSAFE_removeManager() {
    this.entity = none();
    return this;
  }
  getManager<M extends Manager = Manager>() {
    return this.manager as Option<M>;
  }

  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }
  onUpdate() {
    return this;
  }
}

import { Entity } from "./Entity";
import { Manager } from "./Manager";
import { Plugin } from "./Plugin";
