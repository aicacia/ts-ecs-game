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
    } else {
      return this.componentName;
    }
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

  getComponent<C extends Component = Component>(Component: IConstructor<C>) {
    return this.getEntity().flatMap(entity => entity.getComponent(Component));
  }
  getRequiredComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ) {
    return this.getComponent(Component).expect(
      `${this.getComponentName()} Component requires ${(Component as any).getComponentName()} Component`
    );
  }
  getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    return this.getScene().flatMap(scene => scene.getPlugin(Plugin));
  }
  getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).expect(
      `${this.getComponentName()} Component requires ${(Plugin as any).getPluginName()} Plugin`
    );
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
  getRequiredEntity() {
    return this.getEntity().expect(
      `${this.getComponentName()} Component requires an Entity`
    );
  }

  getScene() {
    return this.entity.flatMap(entity => entity.getScene());
  }
  getRequiredScene() {
    return this.getScene().expect(
      `${this.getComponentName()} Component requires a Scene`
    );
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
  getRequiredManager<M extends Manager = Manager>() {
    return this.getManager<M>().expect(
      `${this.getComponentName()} Component requires ${Object.getPrototypeOf(
        this
      ).Manager.getManagerName()} Manager`
    );
  }

  onInit() {
    return this;
  }
  onDetach() {
    return this;
  }
  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }
  shouldUpdate() {
    return true;
  }
  onUpdate() {
    return this;
  }
}

import { IConstructor } from "../utils";
import { DefaultManager } from "./DefaultManager";
import { Entity } from "./Entity";
import { Manager } from "./Manager";
import { Plugin } from "./Plugin";

Component.Manager = DefaultManager;
