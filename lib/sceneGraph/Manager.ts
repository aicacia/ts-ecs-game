import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class Manager extends EventEmitter {
  static managerName: string;
  static managerPriority: number = 0;

  static getManagerName() {
    if (!this.managerName) {
      throw new Error(
        "Invalid managerName for Manager `" + this.managerName + "` " + this
      );
    }
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

  getPlugin<T extends Plugin = Plugin>(Plugin: IConstructor<T>): Option<T> {
    return this.getScene().flatMap(scene => scene.getPlugin(Plugin));
  }
  getRequiredPlugin<T extends Plugin = Plugin>(Plugin: IConstructor<T>) {
    return this.getPlugin(Plugin).expect(
      `${this.getManagerName()} required ${(Plugin as any).getPluginName()} Plugin`
    );
  }

  getManager<T extends Manager = Manager>(Manager: IConstructor<T>): Option<T> {
    return this.getScene().flatMap(scene => scene.getManager(Manager));
  }
  getRequiredManager<T extends Manager = Manager>(Manager: IConstructor<T>) {
    return this.getManager(Manager).expect(
      `${this.getManagerName()} required ${(Manager as any).getManagerName()} Manager`
    );
  }

  getComponents<T extends Component = Component>() {
    return this.components as T[];
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

  sortFunction(a: Component, b: Component) {
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
    this.components.forEach(
      component => component.shouldUpdate() && component.onUpdate()
    );
    return this;
  }
}

export class DefaultManager extends Manager {
  static managerName = "engine.DefaultManager";
}

import { IConstructor } from "../utils";
import { Component } from "./Component";
import { Plugin } from "./Plugin";
import { Scene } from "./Scene";
