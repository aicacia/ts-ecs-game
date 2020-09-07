import { IJSONObject, isJSONArray } from "@aicacia/json";
import { none, Option, some, IConstructor } from "@aicacia/core";
import { EventEmitter } from "events";

// tslint:disable-next-line: interface-name
export interface Entity {
  on(
    event: "add-component" | "remove-component",
    listener: (component: Component) => void
  ): this;
  on(
    event: "add-child" | "remove-child",
    listener: (child: Entity) => void
  ): this;
}

export class Entity extends EventEmitter {
  private name = "";
  private depth = 0;
  private scene: Option<Scene> = none();
  private root: Entity = this;
  private parent: Option<Entity> = none();
  private tags: Set<string> = new Set();
  private children: Entity[] = [];
  private components: Component[] = [];
  private componentMap: Map<IConstructor<Component>, Component> = new Map();

  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
    return this;
  }

  hasTags(tags: string[]) {
    return tags.every((tag) => this.tags.has(tag));
  }
  hasTag(...tags: string[]) {
    return this.hasTags(tags);
  }
  getTags() {
    return this.tags;
  }
  addTags(tags: string[]) {
    tags.forEach((tag) => this.tags.add(tag));
    return this;
  }
  addTag(...tags: string[]) {
    return this.addTags(tags);
  }

  getDepth() {
    return this.depth;
  }
  getRoot() {
    return this.root;
  }
  isRoot() {
    return this.root === this;
  }

  getParent(): Option<Entity> {
    return this.parent;
  }

  hasScene() {
    return this.scene.isSome();
  }
  getScene(): Option<Scene> {
    return this.scene;
  }
  getRequiredScene() {
    return this.getScene().expect("Entity expected to have a Scene");
  }
  UNSAFE_setScene(scene: Scene, recur = false) {
    this.scene = some(scene);
    if (recur) {
      this.forEachChild((child) => child.UNSAFE_setScene(scene, recur), false);
    }
    return this;
  }
  UNSAFE_removeScene() {
    this.scene = none();
    return this;
  }

  forEachChild(fn: (entity: Entity) => void, recur = true) {
    this.getChildren().forEach((child) => {
      fn(child);

      if (recur) {
        child.forEachChild(fn, recur);
      }
    });
    return this;
  }
  find(fn: (entity: Entity) => boolean, recur = true): Option<Entity> {
    const children = this.getChildren();

    for (const child of children) {
      if (fn(child)) {
        return some(child);
      } else if (recur) {
        const found = child.find(fn, recur);

        if (found.isSome()) {
          return found;
        }
      }
    }

    return none();
  }
  findWithName(name: string) {
    return this.find((entity) => entity.getName() === name);
  }
  findWithTag(...tags: string[]) {
    return this.find((entity) => entity.hasTags(tags));
  }
  findWithTags(tags: string[]) {
    return this.findWithTag(...tags);
  }
  findWithComponent<C extends Component>(Component: IConstructor<C>) {
    return this.find((entity) => entity.getComponent(Component).isSome());
  }

  findAll(fn: (entity: Entity) => boolean, recur = true): Entity[] {
    const children = this.getChildren(),
      matching = [];

    for (const child of children) {
      if (fn(child)) {
        matching.push(child);
      } else if (recur) {
        matching.push(...child.findAll(fn, recur));
      }
    }

    return matching;
  }
  findAllWithName(name: string, recur = true) {
    return this.findAll((entity) => entity.getName() === name, recur);
  }
  findAllWithTag(...tags: string[]) {
    return this.findAll((entity) => entity.hasTags(tags));
  }
  findAllWithTags(tags: string[]) {
    return this.findAllWithTag(...tags);
  }
  findAllWithComponent<C extends Component>(
    Component: IConstructor<C>,
    recur = true
  ) {
    return this.findAll(
      (entity) => entity.getComponent(Component).isSome(),
      recur
    );
  }

  findParent(fn: (entity: Entity) => boolean): Option<Entity> {
    return this.getParent().flatMap((parent) => {
      if (fn(parent)) {
        return some(parent);
      } else {
        return parent.findParent(fn);
      }
    });
  }

  getComponents() {
    return this.components;
  }
  hasComponent<C extends Component = Component>(Component: IConstructor<C>) {
    return this.getComponent(Component).isSome();
  }
  getComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ): Option<C> {
    return Option.from(this.componentMap.get(Component) as C);
  }
  getRequiredComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ) {
    return this.getComponent(Component).expect(
      `Entity expected to have a ${Component} Component`
    );
  }
  getComponentInstanceOf<C extends Component = Component>(
    Component: IConstructor<C>
  ) {
    return Option.from(
      this.components.find((component) => component instanceof Component) as C
    );
  }
  getComponentsInstanceOf<C extends Component = Component>(
    Component: IConstructor<C>
  ) {
    return this.components.filter(
      (component) => component instanceof Component
    ) as C[];
  }

  addComponents(components: Component[]) {
    components.forEach((component) => this._addComponent(component));
    return this;
  }
  addComponent(...components: Component[]) {
    return this.addComponents(components);
  }

  removeComponents(components: IConstructor<Component>[]) {
    components.forEach((component) => this._removeComponent(component));
    return this;
  }
  removeComponent(...components: IConstructor<Component>[]) {
    return this.removeComponents(components);
  }

  removeFromScene() {
    this.scene.map((scene) => {
      scene.removeEntity(this);
    });
  }
  detach() {
    this.parent.map((parent) => {
      parent._removeChild(this);
      this.scene.map((scene) => scene.addEntity(this));
      this.getComponents().forEach((component) => component.onDetach());
    });
  }
  getChildren() {
    return this.children;
  }
  addChildren(children: Entity[]) {
    children.forEach((child) => this._addChild(child));
    return this;
  }
  addChild(...children: Entity[]) {
    return this.addChildren(children);
  }

  removeChildren(...children: Entity[]) {
    children.forEach((child) => this._removeChild(child));
    return this;
  }
  removeChild(...children: Entity[]) {
    return this.removeChildren(...children);
  }

  validateRequirements() {
    const missingComponents: IRequirement<Component>[] = [],
      missingPlugins: IRequirement<Plugin>[] = [];

    for (const component of this.components) {
      filterRequirements(
        missingComponents,
        component.getRequiredComponents(),
        (C) => !this.hasComponent(C)
      );
      filterRequirements(
        missingPlugins,
        component.getRequiredPlugins(),
        (P) => !this.getRequiredScene().hasPlugin(P)
      );
    }

    if (missingComponents.length > 0 || missingPlugins.length > 0) {
      const componentMessage = missingComponents.map(
        (missingRequirement) =>
          `Entity requires ${requirementToString(missingRequirement)} Component`
      );
      const pluginMessage = missingPlugins.map(
        (missingRequirement) =>
          `Entity requires ${requirementToString(missingRequirement)} Plugin`
      );
      const message =
        componentMessage.length > 0
          ? componentMessage.join("\n") + "\n"
          : "" + pluginMessage.join("\n");

      throw new Error(message);
    }
  }

  private _addComponent<C extends Component>(component: C) {
    const Component = component.getConstructor();

    if (!this.componentMap.has(Component)) {
      component.UNSAFE_setEntity(this);

      this.components.push(component);
      this.componentMap.set(Component, component);

      this.scene.map((scene) => scene.UNSAFE_addComponent(component));
      this.emit("add-component", component);
    }
    return this;
  }

  private _removeComponent<C extends Component>(Component: IConstructor<C>) {
    const componentOption = this.getComponent(Component);

    componentOption.ifSome((component) => {
      this.emit("remove-component", component);
      component.UNSAFE_removeEntity();

      this.components.splice(this.components.indexOf(component), 1);
      this.componentMap.delete(Component);

      this.scene.map((scene) => scene.UNSAFE_removeComponent(component));
    });
    return this;
  }

  private _addChild(child: Entity) {
    if (this.children.indexOf(child) === -1) {
      if (child.isRoot()) {
        child.scene.map((scene) => scene.removeEntity(child));
      }
      child.parent.map((parent) => parent._removeChild(child));

      this.children.push(child);

      child.scene = this.scene;
      child.parent = some(this);
      child.root = this.root;
      child.setDepth(this.depth + 1);

      this.emit("add-child", child);
    }
    return this;
  }
  private _removeChild(child: Entity) {
    const index = this.children.indexOf(child);

    if (index !== -1) {
      this.emit("remove-child", child);
      this.children.splice(index, 1);

      child.scene = none();
      child.parent = none();
      child.root = child;
      child.setDepth(0);
    }
    return this;
  }

  private setDepth(depth: number) {
    this.depth = depth;
    this.children.forEach((child) => child.setDepth(depth + 1));
    return this;
  }

  private setParent(parent: Entity) {
    this.parent = some(parent);
    return this;
  }

  toJSON(): IJSONObject {
    return {
      name: this.name,
      depth: this.depth,
      tags: [...this.tags.values()],
      children: this.children.map((child) => child.toJSON()),
      components: this.components.map((component) => component.toJSON()),
    };
  }
  fromJSON(json: IJSONObject) {
    this.name = json.name as string;
    this.depth = json.depth as number;
    if (isJSONArray(json.tags)) {
      json.tags.forEach((tag) => this.tags.add(tag as string));
    }
    if (isJSONArray(json.children)) {
      json.children.forEach((child) =>
        this.children.push(
          new Entity().fromJSON(child as IJSONObject).setParent(this)
        )
      );
    }
    if (isJSONArray(json.children)) {
      json.children.forEach((child) =>
        this.children.push(new Entity().fromJSON(child as IJSONObject))
      );
    }
    return this;
  }
}

import {
  filterRequirements,
  IRequirement,
  requirementToString,
} from "./IRequirement";
import { Component } from "./Component";
import { Plugin } from "./Plugin";
import { Scene } from "./Scene";