import { none, Option, some } from "@aicacia/core";

export abstract class Manager {
  static managerName: string;

  static getManagerName(): string {
    return this.managerName;
  }

  protected scene: Option<Scene> = none();
  protected components: Component[] = [];

  getManagerName(): string {
    return Object.getPrototypeOf(this).constructor.getName();
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

  sortFunction = (a: Component, b: Component): number =>
    a
      .getEntity()
      .flatMap(aEntity =>
        b.getEntity().map(bEntity => aEntity.getDepth() - bEntity.getDepth())
      )
      .unwrapOr(0);

  sort() {
    this.components.sort(this.sortFunction);
    return this;
  }

  setScene(scene: Scene) {
    this.scene = some(scene);
    return this;
  }
  UNSAFE_removeScene() {
    this.scene = none();
    return this;
  }
  geScene(): Option<Scene> {
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
