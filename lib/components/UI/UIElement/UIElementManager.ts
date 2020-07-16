import { Manager } from "../../../sceneGraph";

export class UIElementManager extends Manager<UIElement> {
  private layers: Record<number, UIElement[]> = {};

  isEmpty() {
    return Object.values(this.layers).length === 0;
  }

  getComponents() {
    return ([] as UIElement[]).concat(...Object.values(this.layers));
  }

  addComponent(sprite: UIElement) {
    this.getOrCreateLayer(sprite.getLayer()).push(sprite);
    return this;
  }
  removeComponent(sprite: UIElement) {
    const layerIndex = sprite.getLayer(),
      layer = this.layers[layerIndex];

    if (layer) {
      const index = layer.indexOf(sprite);

      if (index !== -1) {
        layer.splice(index, 1);

        if (layer.length === 0) {
          delete this.layers[layerIndex];
        }
      }
    }

    return this;
  }

  sortFunction = (a: UIElement, b: UIElement) => {
    return a
      .getEntity()
      .flatMap((aEntity) =>
        b.getEntity().map((bEntity) => aEntity.getDepth() - bEntity.getDepth())
      )
      .unwrapOr(0);
  };

  sort() {
    Object.values(this.layers).forEach((layer) =>
      layer.sort(this.sortFunction)
    );
    return this;
  }

  onInit() {
    Object.values(this.layers).forEach((layer) =>
      layer.forEach((sprite) => sprite.onInit())
    );
    return this;
  }
  onUpdate() {
    Object.values(this.layers).forEach((layer) =>
      layer.forEach((sprite) => sprite.onUpdate())
    );
    return this;
  }
  onAfterUpdate() {
    Object.values(this.layers).forEach((layer) =>
      layer.forEach((sprite) => sprite.onAfterUpdate())
    );
    return this;
  }

  private getOrCreateLayer(layerIndex: number) {
    const layer = this.layers[layerIndex];

    if (layer) {
      return layer;
    } else {
      const newLayer: UIElement[] = [];
      this.layers[layerIndex] = newLayer;
      return newLayer;
    }
  }
}

import { UIElement } from "./UIElement";
