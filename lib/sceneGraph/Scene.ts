import { iter, Option } from "@stembord/core";
import { EventEmitter } from "events";

export class Scene extends EventEmitter {
  private entities: Entity[] = [];
  private entitiesToAdd: Entity[] = [];
  private entitiesToRemove: Entity[] = [];

  private managers: Manager[] = [];
  private managerMap: Record<string, Manager> = {};

  private plugins: Plugin[] = [];
  private pluginsMap: Record<string, Plugin> = {};

  maintain() {
    this.emit("maintain");
    this.entitiesToAdd.forEach(entity => this.addEntityNow(entity));
    this.entitiesToAdd.length = 0;
    this.entitiesToRemove.forEach(entity => this.removeEntityNow(entity));
    this.entitiesToRemove.length = 0;
    return this;
  }

  update() {
    this.emit("update");
    this.maintain();
    this.plugins.forEach(plugin => plugin.onUpdate());
    this.managers.forEach(manager => manager.onUpdate());
    this.plugins.forEach(plugin => plugin.onAfterUpdate());
    return this;
  }

  find(fn: (entity: Entity) => boolean): Option<Entity> {
    return iter(this.getEntities()).find(fn);
  }

  getEntities() {
    return this.entities;
  }

  getManagers() {
    return this.managers;
  }
  getManager<T extends Manager>(Manager: new (...args: any[]) => T): Option<T> {
    return Option.from(this.managerMap[(Manager as any).getManagerName()] as T);
  }

  getPlugins() {
    return this.plugins;
  }
  getPlugin<T extends Plugin>(Plugin: new (...args: any[]) => T): Option<T> {
    return Option.from(this.pluginsMap[(Plugin as any).getPluginName()] as T);
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

  addEntityNow(entity: Entity) {
    if (this.entities.indexOf(entity) === -1) {
      entity.getScene().map(scene => scene.removeEntity(entity));

      this.entities.push(entity);
      entity.UNSAFE_setScene(this);

      entity
        .getComponents()
        .forEach(component => this.UNSAFE_addComponent(component));
      entity.getChildren().forEach(child => this.addEntityNow(child));

      this.emit("add-entity", entity);
    }
    return this;
  }
  removeEntityNow(entity: Entity) {
    const index = this.entities.indexOf(entity);

    if (index !== -1) {
      this.entities.splice(index, 1);
      entity.UNSAFE_removeScene();

      entity
        .getComponents()
        .forEach(component => this.UNSAFE_removeComponent(component));
      entity.getChildren().forEach(child => this.removeEntityNow(child));

      this.emit("remove-entity", entity);
    }
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

  private _addPlugin<T extends Plugin>(plugin: T) {
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
  private _removePlugin<T extends Plugin>(Plugin: new (...args: any[]) => T) {
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

import { Component } from "./Component";
import { Entity } from "./Entity";
import { Manager } from "./Manager";
import { Plugin } from "./Plugin";
