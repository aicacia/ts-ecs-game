import { RenderableComponent } from "../RenderableComponent";

export class Sprite extends RenderableComponent {
  static componentName = "engine.Sprite";

  private layer: number = 0;

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

import { SpriteManager } from "./SpriteManager";

Sprite.Manager = SpriteManager;
