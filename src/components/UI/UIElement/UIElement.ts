import { RenderableComponent } from "../../RenderableComponent";
import { Transform2D } from "../../Transform2D";
import { Transform3D } from "../../Transform3D";

export class UIElement extends RenderableComponent {
  static requiredComponents = [[Transform2D, Transform3D]];

  private dirty = true;
  private layer = 0;

  isDirty() {
    return this.dirty;
  }
  setDirty(dirty = true) {
    this.dirty = !!dirty;
    return this;
  }

  getLayer() {
    return this.layer;
  }
  setLayer(layer: number) {
    const managerOption = this.getManager<UIElementManager>();
    managerOption.ifSome((manager) => manager.removeComponent(this));
    this.layer = layer | 0;
    managerOption.ifSome((manager) => manager.addComponent(this));
    return this;
  }
}

import { UIElementManager } from "./UIElementManager";

UIElement.Manager = UIElementManager;
