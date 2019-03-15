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
  getManagerConstructor<M extends Manager = Manager>(): new () => M {
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

  setManager<M extends Manager = Manager>(manager: M) {
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
