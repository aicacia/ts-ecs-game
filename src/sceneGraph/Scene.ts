import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

// tslint:disable-next-line: interface-name
export interface Scene {
  on(event: "maintain" | "update", listener: () => void): this;
  on(
    event: "add-component" | "remove-component",
    listener: (component: Component) => void
  ): this;
  on(
    event: "add-plugin" | "remove-plugin",
    listener: (entity: Plugin) => void
  ): this;
  on(
    event: "add-entity" | "remove-entity",
    listener: (entity: Entity) => void
  ): this;
}

export class Scene extends EventEmitter {
  private entities: Entity[] = [];
  private entitiesToAdd: Entity[] = [];
  private entitiesToRemove: Entity[] = [];

  private managers: Manager[] = [];
  private managerMap: Map<IConstructor<Manager>, Manager> = new Map();

  private plugins: Plugin[] = [];
  private pluginsMap: Map<IConstructor<Plugin>, Plugin> = new Map();

  private isUpdating = false;
  private isInitted = false;

  maintain() {
    this.emit("maintain");
    this.entitiesToAdd.forEach((entity) => this.addEntityNow(entity, true));
    this.entitiesToAdd.length = 0;
    this.entitiesToRemove.forEach((entity) =>
      this.removeEntityNow(entity, true)
    );
    this.entitiesToRemove.length = 0;
    return this;
  }

  update() {
    this.isUpdating = true;
    this.emit("update");
    this.maintain();
    if (!this.isInitted) {
      this.isInitted = true;
      this.plugins.forEach((plugin) => plugin.onInit());
    }
    this.plugins.forEach((plugin) => plugin.onUpdate());
    this.managers.forEach((manager) => manager.onUpdate());
    this.managers.forEach((manager) => manager.onAfterUpdate());
    this.plugins.forEach((plugin) => plugin.onAfterUpdate());
    this.isUpdating = false;
    return this;
  }

  find(fn: (entity: Entity) => boolean, recur = true): Option<Entity> {
    const entities = this.getEntities();

    for (const entity of entities) {
      if (fn(entity)) {
        return some(entity);
      } else if (recur) {
        const found = entity.find(fn, recur);

        if (found.isSome()) {
          return found;
        }
      }
    }

    return none();
  }
  findWithTag(...tags: string[]) {
    return this.find((entity) => entity.hasTags(tags));
  }
  findWithTags(tags: string[]) {
    return this.findWithTag(...tags);
  }
  findWithName(name: string) {
    return this.find((entity) => entity.getName() === name);
  }

  findAll(fn: (entity: Entity) => boolean, recur = true): Entity[] {
    const entities = this.getEntities(),
      matching = [];

    for (const entity of entities) {
      if (fn(entity)) {
        matching.push(entity);
      } else if (recur) {
        matching.push(...entity.findAll(fn, recur));
      }
    }

    return matching;
  }
  findAllWithTag(...tags: string[]) {
    return this.findAll((entity) => entity.hasTags(tags));
  }
  findAllWithTags(tags: string[]) {
    return this.findAllWithTag(...tags);
  }
  findAllWithName(name: string) {
    return this.findAll((entity) => entity.getName() === name);
  }

  getEntities() {
    return this.entities;
  }

  getManagers() {
    return this.managers;
  }
  getManager<M extends Manager>(Manager: IConstructor<M>): Option<M> {
    return Option.from(this.managerMap.get(Manager)) as Option<M>;
  }
  getRequiredManager<M extends Manager>(Manager: IConstructor<M>) {
    return this.getManager(Manager).expect(`Scene required ${Manager} Manager`);
  }

  getPlugins() {
    return this.plugins;
  }
  hasPlugin<P extends Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).isSome();
  }
  getPlugin<P extends Plugin>(Plugin: IConstructor<P>): Option<P> {
    return Option.from(this.pluginsMap.get(Plugin)) as Option<P>;
  }
  getRequiredPlugin<P extends Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).expect(`Scene required ${Plugin} Plugin`);
  }

  addPlugins(plugins: Plugin[]) {
    plugins.forEach((plugin) => this._addPlugin(plugin));
    this.sortPlugins();
    return this;
  }
  addPlugin(...plugins: Plugin[]) {
    return this.addPlugins(plugins);
  }

  removePlugins(plugins: IConstructor<Plugin>[]) {
    plugins.forEach((plugin) => this._removePlugin(plugin));
    return this;
  }
  removePlugin(...plugins: IConstructor<Plugin>[]) {
    return this.removePlugins(plugins);
  }

  addEntities(entities: Entity[]) {
    this.entitiesToAdd.push(...entities);
    return this;
  }
  addEntity(...entities: Entity[]) {
    return this.addEntities(entities);
  }

  removeEntities(entities: Entity[]) {
    this.entitiesToRemove.push(...entities);
    return this;
  }
  removeEntity(...entities: Entity[]) {
    return this.removeEntities(entities);
  }

  addEntityNow(entity: Entity, force = false) {
    if (this.isUpdating && !force) {
      throw new Error(
        "Scene.addEntityNow called while updating, use force to suppress this Error"
      );
    }
    return this._addEntityNow(entity, false);
  }

  removeEntityNow(entity: Entity, force = false) {
    if (this.isUpdating && !force) {
      throw new Error(
        "Scene.removeEntityNow called while updating, use force to suppress this Error"
      );
    }

    entity
      .getComponents()
      .forEach((component) => this.UNSAFE_removeComponent(component));

    if (entity.isRoot()) {
      const index = this.entities.indexOf(entity);

      if (index !== -1) {
        this.entities.splice(index, 1);
        entity.UNSAFE_removeScene();
      }
    } else {
      entity.getParent().map((parent) => parent.removeChild(entity));
    }

    entity.getChildren().forEach((child) => this.removeEntityNow(child, true));
    this.emit("remove-entity", entity);

    return this;
  }

  UNSAFE_addComponent(component: Component) {
    const Manager: IConstructor<Manager> = component.getManagerConstructor();

    const managerOption = this.getManager(Manager);
    let manager: Manager;

    if (managerOption.isNone()) {
      manager = new Manager();

      managerOption.replace(manager);

      manager.UNSAFE_setScene(this);

      this.managers.push(manager);
      this.managerMap.set(Manager, manager);
      this.sortManagers();

      manager.onAdd();
    } else {
      manager = managerOption.unwrap();
    }

    manager.addComponent(component);
    component.UNSAFE_setManager(manager);

    manager.sort();
    component.onAdd();

    this.emit("add-component", component);

    return this;
  }

  UNSAFE_removeComponent(component: Component) {
    const Manager: IConstructor<Manager> = component.getManagerConstructor();

    const managerOption = this.getManager(Manager);

    this.emit("remove-component", component);

    managerOption.ifSome((manager) => {
      component.onRemove();

      manager.removeComponent(component);
      component.UNSAFE_removeManager();

      if (manager.isEmpty()) {
        manager.onRemove();

        this.managers.splice(this.managers.indexOf(manager), 1);
        this.managerMap.delete(Manager);
      }
    });

    return this;
  }
  private _addEntityNow(entity: Entity, isChild: boolean) {
    entity.getScene().map((scene) => scene.removeEntityNow(entity, true));

    if (entity.isRoot()) {
      this.entities.push(entity);
    } else if (!isChild) {
      throw new Error(
        "Scene trying to add an Entity that has a parent to the Scene"
      );
    }

    entity.UNSAFE_setScene(this);
    entity
      .getComponents()
      .forEach((component) => this.UNSAFE_addComponent(component));
    entity.getChildren().forEach((child) => this._addEntityNow(child, true));

    if (process.env.NODE_ENV !== "production") {
      entity.validateRequirements();
    }

    this.emit("add-entity", entity);

    return this;
  }

  private _addPlugin<P extends Plugin>(plugin: P) {
    const Plugin: IConstructor<Plugin> = plugin.getConstructor(),
      index = this.plugins.indexOf(plugin);

    if (index === -1) {
      this.plugins.push(plugin);
      this.pluginsMap.set(Plugin, plugin);
      plugin.UNSAFE_setScene(this);
      if (this.isInitted) {
        plugin.onInit();
      }
      plugin.onAdd();
      if (process.env.NODE_ENV !== "production") {
        plugin.validateRequirements();
      }
      this.sortPlugins();
      this.emit("add-plugin", plugin);
    }
    return this;
  }
  private _removePlugin<P extends Plugin>(Plugin: IConstructor<P>) {
    const pluginOption = this.getPlugin(Plugin);

    pluginOption.ifSome((plugin) => {
      this.emit("remove-plugin", plugin);
      plugin.onRemove();
      plugin.UNSAFE_removeScene();
      this.plugins.splice(this.plugins.indexOf(plugin), 1);
      this.pluginsMap.delete(Plugin);
    });

    return this;
  }

  private sortPlugins() {
    this.plugins.sort(this.pluginSortFunction);
  }
  private pluginSortFunction(a: Plugin, b: Plugin) {
    return a.getPluginPriority() - b.getPluginPriority();
  }

  private sortManagers() {
    this.managers.sort(this.managerSortFunction);
  }
  private managerSortFunction(a: Manager, b: Manager) {
    return a.getManagerPriority() - b.getManagerPriority();
  }
}

import { IConstructor } from "../utils";
import { Component } from "./Component";
import { Entity } from "./Entity";
import { Manager } from "./Manager";
import { Plugin } from "./Plugin";
