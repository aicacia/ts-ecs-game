import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export class Scene extends EventEmitter {
  private entities: Entity[] = [];
  private entitiesToAdd: Entity[] = [];
  private entitiesToRemove: Entity[] = [];

  private managers: Manager[] = [];
  private managerMap: Record<string, Manager> = {};

  private plugins: Plugin[] = [];
  private pluginsMap: Record<string, Plugin> = {};

  private isUpdating: boolean = false;

  maintain() {
    this.emit("maintain");
    this.entitiesToAdd.forEach(entity => this.addEntityNow(entity, true));
    this.entitiesToAdd.length = 0;
    this.entitiesToRemove.forEach(entity => this.removeEntityNow(entity, true));
    this.entitiesToRemove.length = 0;
    return this;
  }

  update() {
    this.isUpdating = true;
    this.emit("update");
    this.maintain();
    this.plugins.forEach(plugin => plugin.onUpdate());
    this.managers.forEach(manager => manager.onUpdate());
    this.plugins.forEach(plugin => plugin.onAfterUpdate());
    this.isUpdating = false;
    return this;
  }

  find(fn: (entity: Entity) => boolean, recur: boolean = true): Option<Entity> {
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
    return this.find(entity => entity.hasTags(tags));
  }
  findWithTags(tags: string[]) {
    return this.findWithTag(...tags);
  }
  findWithName(name: string) {
    return this.find(entity => entity.getName() === name);
  }

  getEntities() {
    return this.entities;
  }

  getManagers() {
    return this.managers;
  }
  getManager<M extends Manager>(Manager: IConstructor<M>): Option<M> {
    return Option.from(
      this.managerMap[(Manager as any).getManagerName()]
    ) as Option<M>;
  }
  getRequiredManager<M extends Manager>(Manager: IConstructor<M>) {
    return this.getManager(Manager).expect(
      `Scene required ${(Manager as any).getManagerName()} Manager`
    );
  }

  getPlugins() {
    return this.plugins;
  }
  getPlugin<P extends Plugin>(Plugin: IConstructor<P>): Option<P> {
    return Option.from(
      this.pluginsMap[(Plugin as any).getPluginName()]
    ) as Option<P>;
  }
  getRequiredPlugin<P extends Plugin>(Plugin: IConstructor<P>) {
    return this.getPlugin(Plugin).expect(
      `Scene required ${(Plugin as any).getPluginName()} Plugin`
    );
  }

  addPlugins(plugins: Plugin[]) {
    plugins.forEach(plugin => this._addPlugin(plugin));
    this.sortPlugins();
    return this;
  }
  addPlugin(...plugins: Plugin[]) {
    return this.addPlugins(plugins);
  }

  removePlugins(plugins: Array<new (...args: any[]) => Plugin>) {
    plugins.forEach(plugin => this._removePlugin(plugin));
    return this;
  }
  removePlugin(...plugins: Array<new (...args: any[]) => Plugin>) {
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

  addEntityNow(entity: Entity, force: boolean = false) {
    if (this.isUpdating && !force) {
      throw new Error(
        "Scene.addEntityNow called while updating, use force to suppress this Error"
      );
    }
    return this._addEntityNow(entity, false);
  }

  removeEntityNow(entity: Entity, force: boolean = false) {
    if (this.isUpdating && !force) {
      throw new Error(
        "Scene.removeEntityNow called while updating, use force to suppress this Error"
      );
    }

    if (entity.isRoot()) {
      const index = this.entities.indexOf(entity);

      if (index !== -1) {
        this.entities.splice(index, 1);
        entity.UNSAFE_removeScene();
      }
    } else {
      entity.getParent().map(parent => parent.removeChild(entity));
    }

    entity
      .getComponents()
      .forEach(component => this.UNSAFE_removeComponent(component));
    entity.getChildren().forEach(child => this.removeEntityNow(child, true));

    this.emit("remove-entity", entity);

    return this;
  }

  UNSAFE_addComponent(component: Component) {
    const Manager: any = component.getManagerConstructor(),
      managerName = Manager.getManagerName();

    let manager: Manager = this.managerMap[managerName];

    if (!manager) {
      manager = new Manager();

      manager.UNSAFE_setScene(this);

      this.managers.push(manager);
      this.managerMap[managerName] = manager;
      this.sortManagers();

      manager.onAdd();
    }

    manager.addComponent(component);
    component.UNSAFE_setManager(manager);

    manager.sort();
    component.onAdd();

    this.emit("add-component", component);

    return this;
  }

  UNSAFE_removeComponent(component: Component) {
    const Manager: any = component.getManagerConstructor(),
      managerName = Manager.managerName;

    const manager: Manager = this.managerMap[managerName],
      index = this.managers.indexOf(manager);

    this.emit("remove-component", component);

    if (manager) {
      component.onRemove();

      manager.removeComponent(component);
      component.UNSAFE_removeManager();

      if (manager.isEmpty()) {
        manager.onRemove();

        this.managers.splice(index, 1);
        delete this.managerMap[managerName];
      }
    }

    return this;
  }
  private _addEntityNow(entity: Entity, isChild: boolean) {
    entity.getScene().map(scene => scene.removeEntityNow(entity, true));

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
      .forEach(component => this.UNSAFE_addComponent(component));
    entity.getChildren().forEach(child => this._addEntityNow(child, true));

    this.emit("add-entity", entity);

    return this;
  }

  private _addPlugin<P extends Plugin>(plugin: P) {
    const index = this.plugins.indexOf(plugin);

    if (index === -1) {
      this.plugins.push(plugin);
      this.pluginsMap[plugin.getPluginName()] = plugin;
      plugin.UNSAFE_setScene(this);
      plugin.onAdd();
      this.sortPlugins();
      this.emit("add-plugin", plugin);
    }
    return this;
  }
  private _removePlugin<P extends Plugin>(Plugin: IConstructor<P>) {
    const pluginName = (Plugin as any).getPluginName(),
      plugin = this.pluginsMap[pluginName];

    if (plugin) {
      this.emit("remove-plugin", plugin);
      plugin.onRemove();
      plugin.UNSAFE_removeScene();
      this.plugins.splice(this.plugins.indexOf(plugin), 1);
      delete this.pluginsMap[pluginName];
    }
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
