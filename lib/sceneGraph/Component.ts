import { none, Option, some } from "@aicacia/core";

export abstract class Component {
  static Manager: new () => Manager;
  static componentName: string;

  static getComponentName(): string {
    return this.componentName;
  }
  static getManagerConstructor(): new () => Manager {
    return this.Manager;
  }

  protected entity: Option<Entity> = none();
  protected manager: Option<Manager> = none();

  getComponentName(): string {
    return Object.getPrototypeOf(this).constructor.getComponentName();
  }
  getManagerConstructor(): new () => Manager {
    return Object.getPrototypeOf(this).constructor.getManagerConstructor();
  }

  setEntity(entity: Entity) {
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

  setManager(manager: Manager) {
    this.manager = some(manager);
    return this;
  }
  UNSAFE_removeManager() {
    this.entity = none();
    return this;
  }
  getManager() {
    return this.manager;
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
