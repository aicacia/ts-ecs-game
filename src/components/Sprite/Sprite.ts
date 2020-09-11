import { ImageAsset } from "../../plugins/assets/ImageAsset";
import { RenderableComponent } from "../RenderableComponent";

export class Sprite extends RenderableComponent {
  private layer = 0;
  private imageAsset: ImageAsset;

  private clipX = 0;
  private clipY = 0;
  private clipWidth = 1;
  private clipHeight = 1;
  private width = 1;
  private height = 1;

  constructor(imageAsset: ImageAsset) {
    super();

    this.imageAsset = imageAsset;

    if (this.imageAsset.isLoaded()) {
      this.onImageLoadHandler();
    } else {
      this.imageAsset.on("load", this.onImageLoadHandler);
    }
  }

  getClipX() {
    return this.clipX;
  }
  setClipX(clipX: number) {
    this.clipX = clipX;
    return this;
  }

  getClipY() {
    return this.clipY;
  }
  setClipY(clipY: number) {
    this.clipY = clipY;
    return this;
  }

  getClipWidth() {
    return this.clipWidth;
  }
  setClipWidth(clipWidth: number) {
    this.clipWidth = clipWidth;
    return this;
  }

  getClipHeight() {
    return this.clipHeight;
  }
  setClipHeight(clipHeight: number) {
    this.clipHeight = clipHeight;
    return this;
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
    const managerOption = this.getManager();
    managerOption.ifSome((manager) => manager.removeComponent(this));
    this.layer = layer | 0;
    managerOption.ifSome((manager) => manager.addComponent(this));
    return this;
  }

  getImageAsset() {
    return this.imageAsset;
  }
  setImageAsset(imageAsset: ImageAsset) {
    this.imageAsset = imageAsset;
    return this;
  }

  private onImageLoadHandler = () => {
    this.clipWidth = this.imageAsset.getWidth();
    this.clipHeight = this.imageAsset.getHeight();
    this.imageAsset.off("load", this.onImageLoadHandler);
  };
}

import { SpriteManager } from "./SpriteManager";

Sprite.Manager = SpriteManager;
