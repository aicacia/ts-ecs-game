import { Manager } from "../../../sceneGraph";

export class UIElementManager extends Manager<UIElement> {
  private layers: Map<number, UIElement[]> = new Map();

  isEmpty() {
    return this.layers.size === 0;
  }

  getLayers() {
    return Array.from(this.layers.entries()).sort(
      ([aLayer, _aElements], [bLayer, _bElements]) => aLayer - bLayer
    );
  }

  getComponents() {
    return ([] as UIElement[]).concat(
      ...this.getLayers().map(([_layer, elements]) => elements)
    );
  }

  addComponent(sprite: UIElement) {
    this.getOrCreateLayer(sprite.getLayer()).push(sprite);
    return this;
  }
  removeComponent(sprite: UIElement) {
    const layerIndex = sprite.getLayer(),
      layer = this.layers.get(layerIndex);

    if (layer) {
      const index = layer.indexOf(sprite);

      if (index !== -1) {
        layer.splice(index, 1);

        if (layer.length === 0) {
          this.layers.delete(layerIndex);
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
    for (const layer of this.layers.values()) {
      layer.sort(this.sortFunction);
    }
    return this;
  }

  onInit() {
    for (const layer of this.layers.values()) {
      layer.forEach((sprite) => sprite.onInit());
    }
    return this;
  }
  onUpdate() {
    for (const layer of this.layers.values()) {
      layer.forEach((sprite) => sprite.onUpdate());
    }
    return this;
  }
  onAfterUpdate() {
    for (const layer of this.layers.values()) {
      layer.forEach((sprite) => sprite.onAfterUpdate());
    }
    return this;
  }

  private getOrCreateLayer(layerIndex: number) {
    const layer = this.layers.get(layerIndex);

    if (layer) {
      return layer;
    } else {
      const newLayer: UIElement[] = [];
      this.layers.set(layerIndex, newLayer);
      return newLayer;
    }
  }
}

import { UIElement } from "./UIElement";
