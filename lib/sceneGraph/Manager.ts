import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class Manager<
  C extends Component = Component
> extends EventEmitter {
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

  getManagerName(): string {
    return Object.getPrototypeOf(this).constructor.getManagerName();
  }
  getManagerPriority(): number {
    return Object.getPrototypeOf(this).constructor.getManagerPriority();
  }

  getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>): Option<P> {
    return this.getScene().flatMap(scene => scene.getPlugin(Plugin));
  }
  getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).expect(
      `${this.getManagerName()} required ${(Plugin as any).getPluginName()} Plugin`
    );
  }

  getManager<M extends Manager = Manager>(Manager: IConstructor<M>): Option<M> {
    return this.getScene().flatMap(scene => scene.getManager(Manager));
  }
  getRequiredManager<M extends Manager = Manager>(Manager: IConstructor<M>) {
    return this.getManager(Manager).expect(
      `${this.getManagerName()} required ${(Manager as any).getManagerName()} Manager`
    );
  }

  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }

  abstract addComponent(component: C): this;
  abstract removeComponent(component: C): this;
  abstract isEmpty(): boolean;
  abstract sort(): this;
  abstract onInit(): this;
  abstract onUpdate(): this;
}

import { IConstructor } from "../utils";
import { Component } from "./Component";
import { Plugin } from "./Plugin";
import { Scene } from "./Scene";
