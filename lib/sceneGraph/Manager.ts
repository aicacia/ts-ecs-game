import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class Manager extends EventEmitter {
  static managerName: string;
  static managerPriority: number = 0;

  static getManagerName() {
    return this.managerName;
  }
  static getManagerPriority() {
    return this.managerPriority;
  }

  protected scene: Option<Scene> = none();
  protected components: Component[] = [];

  getManagerName(): string {
    return Object.getPrototypeOf(this).constructor.getManagerName();
  }
  getManagerPriority(): number {
    return Object.getPrototypeOf(this).constructor.getManagerPriority();
  }

  addComponent(component: Component) {
    this.components.push(component);
    return this;
  }
  removeComponent(component: Component) {
    const index = this.components.indexOf(component);

    if (index !== -1) {
      this.components.splice(index, 1);
    }

    return this;
  }
  isEmpty() {
    return this.components.length === 0;
  }

  sortFunction(a: Component, b: Component): number {
    return a
      .getEntity()
      .flatMap(aEntity =>
        b.getEntity().map(bEntity => aEntity.getDepth() - bEntity.getDepth())
      )
      .unwrapOr(0);
  }

  sort() {
    this.components.sort(this.sortFunction);
    return this;
  }

  UNSAFE_setScene(scene: Scene) {
    this.scene = some(scene);
    return this;
  }
  UNSAFE_removeScene() {
    this.scene = none();
    return this;
  }
  getScene(): Option<Scene> {
    return this.scene;
  }

  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }
  onUpdate() {
    this.components.forEach(component => component.onUpdate());
    return this;
  }
}

import { Component } from "./Component";
import { Scene } from "./Scene";
