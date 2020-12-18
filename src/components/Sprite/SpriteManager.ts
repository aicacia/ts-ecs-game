import { Manager } from "@aicacia/ecs/lib/Manager";
import type { Sprite } from "./Sprite";

export class SpriteManager extends Manager<Sprite> {
  private layers: Record<number, Sprite[]> = {};

  isEmpty() {
    return Object.values(this.layers).length === 0;
  }

  getComponents() {
    return ([] as Sprite[]).concat(...Object.values(this.layers));
  }

  addComponent(sprite: Sprite) {
    this.getOrCreateLayer(sprite.getLayer()).push(sprite);
    return this;
  }
  removeComponent(sprite: Sprite) {
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

  sortFunction = (a: Sprite, b: Sprite) => {
    return a.getRequiredEntity().getDepth() - b.getRequiredEntity().getDepth();
  };

  sort() {
    Object.values(this.layers).forEach((layer) =>
      layer.sort(this.sortFunction)
    );
    return this;
  }

  onInit() {
    return this;
  }
  onUpdate() {
    return this;
  }
  onAfterUpdate() {
    return this;
  }

  private getOrCreateLayer(layerIndex: number) {
    const layer = this.layers[layerIndex];

    if (layer) {
      return layer;
    } else {
      const newLayer: Sprite[] = [];
      this.layers[layerIndex] = newLayer;
      return newLayer;
    }
  }
}
