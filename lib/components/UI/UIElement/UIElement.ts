import { RenderableComponent } from "../../RenderableComponent";

export class UIElement extends RenderableComponent {
  static componentName = "engine.UIElement";

  protected width: number = 0;
  protected height: number = 0;
  private layer: number = 0;

  getWidth() {
    return this.width;
  }
  setWidth(width: number) {
    this.width = width;
    return this;
  }

  getHeight() {
    return this.height;
  }
  setHeight(height: number) {
    this.height = height;
    return this;
  }

  getLayer() {
    return this.layer;
  }
  setLayer(layer: number) {
    const managerOption = this.getManager();
    managerOption.map(manager => manager.removeComponent(this));
    this.layer = layer | 0;
    managerOption.map(manager => manager.addComponent(this));
    return this;
  }
}

import { UIElementManager } from "./UIElementManager";

UIElement.Manager = UIElementManager;
