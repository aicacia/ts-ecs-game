import { mat2d, vec2 } from "gl-matrix";
import { RenderableComponent } from "../../RenderableComponent";

const MAT2D_0: mat2d = mat2d.create(),
  VEC2_0: vec2 = vec2.create(),
  VEC2_1: vec2 = vec2.create();

export class UIElement extends RenderableComponent {
  protected width: number = 0;
  protected height: number = 0;
  private layer: number = 0;

  getLocalAABB(min: vec2, max: vec2) {
    this.getEntity()
      .flatMap(TransformComponent.getTransform)
      .ifSome((transform) => {
        const matrix = transform.getMatrix2d(MAT2D_0),
          hw = this.width * 0.5,
          hh = this.height * 0.5;
        vec2.set(min, -hw, -hh);
        vec2.set(max, hw, hh);
        vec2.transformMat2d(min, min, matrix);
        vec2.transformMat2d(max, max, matrix);
      })
      .ifNone(() => {
        vec2.set(min, 0, 0);
        vec2.set(max, 0, 0);
      });
  }

  getAABB(min: vec2, max: vec2) {
    const childMin = VEC2_0,
      childMax = VEC2_1;

    this.getLocalAABB(min, max);

    this.getRequiredEntity()
      .findAllWithComponent(UIElement, false)
      .forEach((element) => {
        const childElement = element.getRequiredComponent(UIElement);
        childElement.getAABB(childMin, childMax);
        vec2.min(min, min, childMin);
        vec2.max(max, max, childMax);
      });
  }

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
    const managerOption = this.getManager<UIElementManager>();
    managerOption.ifSome((manager) => manager.removeComponent(this));
    this.layer = layer | 0;
    managerOption.ifSome((manager) => manager.addComponent(this));
    return this;
  }
}

import { TransformComponent } from "../../TransformComponent";
import { UIElementManager } from "./UIElementManager";

UIElement.Manager = UIElementManager;
