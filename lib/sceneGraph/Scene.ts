import { Option } from "@aicacia/core";

export class Scene {
  private entities: Entity[] = [];
  private entitiesToAdd: Entity[] = [];
  private entitiesToRemove: Entity[] = [];

  private managers: Manager[] = [];
  private managerMap: Record<string, Manager> = {};

  private plugins: Plugin[] = [];
  private pluginsMap: Record<string, Plugin> = {};

  maintain() {
    this.entitiesToAdd.forEach(entity => this.addEntityNow(entity));
    this.entitiesToAdd.length = 0;
    this.entitiesToRemove.forEach(entity => this.removeEntityNow(entity));
    this.entitiesToRemove.length = 0;
    return this;
  }

  update() {
    this.maintain();
    this.plugins.forEach(plugin => plugin.onUpdate());
    this.managers.forEach(manager => manager.onUpdate());
    this.plugins.forEach(plugin => plugin.onAfterUpdate());
    return this;
  }

  find(fn: (entity: Entity) => boolean): Option<Entity> {
    return this.getEntities()
      .iter()
      .find(fn);
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
  addPlugin<T extends Plugin>(plugin: T) {
    const index = this.plugins.indexOf(plugin);

    if (index === -1) {
      this.plugins.push(plugin);
      this.pluginsMap[plugin.getPluginName()] = plugin;
      plugin.onAdd();
    }
    return this;
  }
  removePlugin<T extends Plugin>(plugin: T) {
    const index = this.plugins.indexOf(plugin);

    if (index !== -1) {
      this.plugins.splice(index, 1);
      delete this.pluginsMap[plugin.getPluginName()];
      plugin.onRemove();
    }
    return this;
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
      entity.setScene(this);

      entity.getChildren().forEach(child => this.addEntityNow(child));
      entity.getComponents().forEach(component => this.addComponent(component));
    }
    return this;
  }
  removeEntityNow(entity: Entity) {
    const index = this.entities.indexOf(entity);

    if (index !== -1) {
      this.entities.splice(index, 1);
      entity.UNSAFE_removeScene();

      entity.getChildren().forEach(child => this.removeEntityNow(child));
      entity
        .getComponents()
        .forEach(component => this.removeComponent(component));
    }
    return this;
  }

  addComponent(component: Component) {
    const Manager: any = component.getManagerConstructor(),
      managerName = Manager.getManagerName();

    let manager: Manager = this.managerMap[managerName];

    if (!manager) {
      manager = new Manager();

      manager.setScene(this);

      this.managers.push(manager);
      this.managerMap[managerName] = manager;

      manager.onAdd();
    }

    manager.addComponent(component);
    component.setManager(manager);

    manager.sort();
    component.onAdd();

    return this;
  }

  removeComponent(component: Component) {
    const Manager: any = component.getManagerConstructor(),
      managerName = Manager.managerName;

    const manager: Manager = this.managerMap[managerName],
      index = this.managers.indexOf(manager);

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
}

import { Component } from "./Component";
import { Entity } from "./Entity";
import { Manager } from "./Manager";
import { Plugin } from "./Plugin";
