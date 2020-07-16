import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class Component extends EventEmitter {
  static Manager: IConstructor<Manager>;
  static requiredComponents: IConstructor<Component>[] = [];
  static requiredPlugins: IConstructor<Plugin>[] = [];

  static getManagerConstructor<M extends Manager = Manager>(): IConstructor<M> {
    if (!this.Manager) {
      throw new Error(this + " invalid Manager `" + this.Manager + "` " + this);
    }
    return this.Manager as IConstructor<M>;
  }
  static getRequiredComponents(): IConstructor<Component>[] {
    return this.requiredComponents;
  }
  static getRequiredPlugins(): IConstructor<Plugin>[] {
    return this.requiredPlugins;
  }

  private entity: Option<Entity> = none();
  private manager: Option<Manager> = none();

  getConstructor(): IConstructor<this> {
    return Object.getPrototypeOf(this).constructor;
  }
  getManagerConstructor<M extends Manager = Manager>(): IConstructor<M> {
    return Object.getPrototypeOf(this).constructor.getManagerConstructor();
  }
  getRequiredComponents(): IConstructor<Component>[] {
    return Object.getPrototypeOf(this).constructor.requiredComponents;
  }
  getRequiredPlugins(): IConstructor<Plugin>[] {
    return Object.getPrototypeOf(this).constructor.requiredPlugins;
  }

  getComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ): Option<C> {
    return this.getEntity().flatMap((entity) => entity.getComponent(Component));
  }
  getRequiredComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ): C {
    return this.getComponent(Component).expect(
      `${this.getConstructor()} Component requires ${Component} Component`
    );
  }
  getPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    return this.getScene().flatMap((scene) => scene.getPlugin(Plugin));
  }
  getRequiredPlugin<P extends Plugin = Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).expect(
      `${this.getConstructor()} Component requires ${Plugin} Plugin`
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
      `${this.getConstructor()} Component requires an Entity`
    );
  }

  getScene() {
    return this.entity.flatMap((entity) => entity.getScene());
  }
  getRequiredScene() {
    return this.getScene().expect(
      `${this.getConstructor()} Component requires a Scene`
    );
  }

  UNSAFE_setManager(manager: Manager) {
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
      `${this.getConstructor()} Component requires ${Object.getPrototypeOf(
        this
      ).getManagerConstructor()} Manager`
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
  onUpdate() {
    return this;
  }
  onAfterUpdate() {
    return this;
  }
}

import { IConstructor } from "../utils";
import { DefaultManager } from "./DefaultManager";
import { Entity } from "./Entity";
import { Manager } from "./Manager";
import { Plugin } from "./Plugin";

Component.Manager = DefaultManager;
