import { Manager } from "../../sceneGraph";

export class SpriteManager extends Manager<Sprite> {
  static managerName = "engine.SpriteManager";

  private layers: Record<number, Sprite[]> = {};

  getComponents() {
    return Object.values(this.layers).flat<Sprite>(0) as Sprite[];
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

  sort() {
    Object.values(this.layers).forEach(layer => layer.sort(this.sortFunction));
    return this;
  }

  onUpdate() {
    Object.values(this.layers).forEach(layer =>
      layer.forEach(sprite => sprite.shouldUpdate() && sprite.onUpdate())
    );
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

import { Sprite } from "./Sprite";
