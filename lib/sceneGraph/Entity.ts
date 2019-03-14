import { none, Option, some } from "@aicacia/core";

export class Entity {
  private depth: number = 0;
  private scene: Option<Scene> = none();
  private root: Entity = this;
  private parent: Option<Entity> = none();
  private tags: string[] = [];
  private children: Entity[] = [];
  private components: Component[] = [];
  private componentMap: Record<string, Component> = {};

  hasTag(tag: string) {
    return this.tags.indexOf(tag) !== -1;
  }
  getTags() {
    return this.tags;
  }
  addTags(tags: string[]) {
    this.tags.push(...tags);
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

  hasParent(): boolean {
    return !!this.parent;
  }
  getParent(): Option<Entity> {
    return this.parent;
  }

  hasScene(): boolean {
    return !!this.scene;
  }
  getScene(): Option<Scene> {
    return this.scene;
  }
  setScene(scene: Scene) {
    this.scene = some(scene);
    return this;
  }
  UNSAFE_removeScene() {
    this.scene = none();
    return this;
  }

  find(
    fn: (entity: Entity) => boolean,
    recur: boolean = false
  ): Option<Entity> {
    const children = this.getChildren(),
      entity = children.find(fn);

    if (!entity) {
      if (recur) {
        for (let i = 0, il = children.length; i < il; i++) {
          const child = children[i].find(fn);

          if (child) {
            return child;
          }
        }
      }

      return none();
    } else {
      return some(entity);
    }
  }

  getComponents() {
    return this.components;
  }
  getComponent<T extends Component = Component>(
    Component: new (...args: any[]) => T
  ): Option<T> {
    return Option.from(this.componentMap[
      (Component as any).getComponentName()
    ] as T);
  }

  addComponent<T extends Component>(component: T) {
    if (!this.componentMap[component.getComponentName()]) {
      component.setEntity(this);

      this.components.push(component);
      this.componentMap[component.getComponentName()] = component;

      this.scene.map(scene => scene.addComponent(component));
    }
    return this;
  }

  removeComponent<T extends Component>(component: T) {
    if (this.componentMap[component.getComponentName()]) {
      component.UNSAFE_removeEntity();

      this.components.splice(this.components.indexOf(component), 1);
      delete this.componentMap[component.getComponentName()];

      this.scene.map(scene => scene.removeComponent(component));
    }
    return this;
  }

  getChildren() {
    return this.children;
  }
  addChildren(...children: Entity[]) {
    children.forEach(child => {
      this._addChild(child);
    });
    return this;
  }
  addChild(...children: Entity[]) {
    return this.addChildren(...children);
  }

  removeChildren(...children: Entity[]) {
    children.forEach(child => {
      this._removeChild(child);
    });
    return this;
  }
  removeChild(...children: Entity[]) {
    return this.removeChildren(...children);
  }

  private _addChild(child: Entity) {
    if (this.children.indexOf(child) === -1) {
      child.parent.map(parent => parent.removeChild(child));

      this.children.push(child);

      child.parent = some(this);
      child.root = this.root;
      child.setDepth(this.depth + 1);

      this.scene.map(scene => scene.addEntity(child));
    }
    return this;
  }
  private _removeChild(child: Entity) {
    const index = this.children.indexOf(child);

    if (index !== -1) {
      this.children.splice(index, 1);

      child.parent = none();
      child.root = this;
      child.setDepth(0);

      this.scene.map(scene => scene.removeEntity(child));
    }
    return this;
  }

  private setDepth(depth: number) {
    this.depth = depth;
    this.children.forEach(child => child.setDepth(depth + 1));
    return this;
  }
}

import { Component } from "./Component";
import { Scene } from "./Scene";
