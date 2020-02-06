import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export class Entity extends EventEmitter {
  private name: string = "";
  private depth: number = 0;
  private scene: Option<Scene> = none();
  private root: Entity = this;
  private parent: Option<Entity> = none();
  private tags: Set<string> = new Set();
  private children: Entity[] = [];
  private components: Component[] = [];
  private componentMap: Record<string, Component> = {};

  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
    return this;
  }

  hasTags(tags: string[]) {
    return tags.every(tag => this.tags.has(tag));
  }
  hasTag(...tags: string[]) {
    return this.hasTags(tags);
  }
  getTags() {
    return this.tags;
  }
  addTags(tags: string[]) {
    tags.forEach(tag => this.tags.add(tag));
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

  getScene(): Option<Scene> {
    return this.scene;
  }
  getRequiredScene() {
    return this.getScene().expect("Entity expected to have a Scene");
  }
  UNSAFE_setScene(scene: Scene) {
    this.scene = some(scene);
    return this;
  }
  UNSAFE_removeScene() {
    this.scene = none();
    return this;
  }

  forEachChild(fn: (entity: Entity) => void, recur: boolean = true) {
    this.getChildren().forEach(child => {
      fn(child);

      if (recur) {
        child.forEachChild(fn, recur);
      }
    });
    return this;
  }
  find(fn: (entity: Entity) => boolean, recur: boolean = true): Option<Entity> {
    const children = this.getChildren(),
      entity = children.find(fn);

    if (!entity) {
      if (recur) {
        for (let i = 0, il = children.length; i < il; i++) {
          const child = children[i].find(fn);

          if (child.isSome()) {
            return child;
          }
        }
      }

      return none();
    } else {
      return some(entity);
    }
  }
  findWithName(name: string) {
    return this.find(entity => entity.getName() === name);
  }
  findWithTag(...tags: string[]) {
    return this.find(entity => entity.hasTags(tags));
  }
  findWithTags(tags: string[]) {
    return this.findWithTag(...tags);
  }
  findWithComponent<C extends Component>(Component: IConstructor<C>) {
    return this.find(entity => entity.getComponent(Component).isSome());
  }

  getComponents() {
    return this.components;
  }
  getComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ): Option<C> {
    return Option.from(
      this.componentMap[(Component as any).getComponentName()] as C
    );
  }
  getRequiredComponent<C extends Component = Component>(
    Component: IConstructor<C>
  ) {
    return this.getComponent(Component).expect(
      `Entity expected to have a ${(Component as any).getComponentName()} Component`
    );
  }

  addComponents(components: Component[]) {
    components.forEach(component => this._addComponent(component));
    return this;
  }
  addComponent(...components: Component[]) {
    return this.addComponents(components);
  }

  removeComponents(components: Array<new (...args: any[]) => Component>) {
    components.forEach(component => this._removeComponent(component));
    return this;
  }
  removeComponent(...components: Array<new (...args: any[]) => Component>) {
    return this.removeComponents(components);
  }

  detach() {
    this.parent.map(parent => {
      parent._removeChild(this);
      this.scene.map(scene => scene.addEntity(this));
      this.getComponents().forEach(component => component.onDetach());
    });
  }
  getChildren() {
    return this.children;
  }
  addChildren(children: Entity[]) {
    children.forEach(child => this._addChild(child));
    return this;
  }
  addChild(...children: Entity[]) {
    return this.addChildren(children);
  }

  removeChildren(...children: Entity[]) {
    children.forEach(child => this._removeChild(child));
    return this;
  }
  removeChild(...children: Entity[]) {
    return this.removeChildren(...children);
  }

  private _addComponent<C extends Component>(component: C) {
    const componentName = component.getComponentName();

    if (!this.componentMap[componentName]) {
      component.UNSAFE_setEntity(this);

      this.components.push(component);
      this.componentMap[componentName] = component;

      this.scene.map(scene => scene.UNSAFE_addComponent(component));
      this.emit("add-component", component);
    }
    return this;
  }

  private _removeComponent<C extends Component>(Component: IConstructor<C>) {
    const componentName = (Component as any).getComponentName(),
      component = this.componentMap[componentName];

    if (component) {
      this.emit("remove-component", component);
      component.UNSAFE_removeEntity();

      this.components.splice(this.components.indexOf(component), 1);
      delete this.componentMap[component.getComponentName()];

      this.scene.map(scene => scene.UNSAFE_removeComponent(component));
    }
    return this;
  }

  private _addChild(child: Entity) {
    if (this.children.indexOf(child) === -1) {
      if (child.isRoot()) {
        child.scene.map(scene => scene.removeEntity(child));
      }
      child.parent.map(parent => parent._removeChild(child));

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
    this.children.forEach(child => child.setDepth(depth + 1));
    return this;
  }
}

import { IConstructor } from "../utils";
import { Component } from "./Component";
import { Scene } from "./Scene";
