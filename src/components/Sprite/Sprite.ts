import { none, Option } from "@aicacia/core";
import { IJSONObject } from "@aicacia/json";
import { Assets } from "../../plugins";
import { ImageAsset } from "../../plugins/assets/ImageAsset";
import { RenderableComponent } from "../RenderableComponent";

export class Sprite extends RenderableComponent {
  static requiredPlugins = [Assets];

  private layer = 0;
  private imageAsset: Option<ImageAsset> = none();

  private clipX = 0;
  private clipY = 0;
  private clipWidth = 1;
  private clipHeight = 1;
  private width = 1;
  private height = 1;

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

  getImageAsset<T extends ImageAsset = ImageAsset>(): Option<T> {
    return this.imageAsset as Option<T>;
  }
  setImageAsset(imageAsset: ImageAsset) {
    this.imageAsset.replace(imageAsset);

    if (imageAsset.isLoaded()) {
      this.onImageLoadHandler();
    } else {
      imageAsset.on("load", this.onImageLoadHandler);
    }

    return this;
  }

  private onImageLoadHandler = () => {
    this.imageAsset.ifSome((imageAsset) => {
      this.clipWidth = imageAsset.getWidth();
      this.clipHeight = imageAsset.getHeight();
      imageAsset.off("load", this.onImageLoadHandler);
    });
  };

  toJSON() {
    return {
      ...super.toJSON(),
      imageAssetUUID: this.imageAsset
        .map((imageAsset) => imageAsset.getUUID() as string | null)
        .unwrapOr(null),
      layer: this.layer,
      clipX: this.clipX,
      clipY: this.clipY,
      clipWidth: this.clipWidth,
      clipHeight: this.clipHeight,
      width: this.width,
      height: this.height,
    };
  }

  fromJSON(json: IJSONObject) {
    const onAddToScene = () => {
      this.setImageAsset(
        this.getRequiredPlugin(Assets)
          .getAsset<ImageAsset>(json.imageAssetUUID as string)
          .expect(`Sprite.fromJSON Failed to get Asset ${json.imageAssetUUID}`)
      );
      this.off("add-to-scene", onAddToScene);
    };

    this.on("add-to-scene", onAddToScene);

    return super
      .fromJSON(json)
      .setLayer(json.layer as number)
      .setClipX(json.clipX as number)
      .setClipY(json.clipY as number)
      .setClipWidth(json.clipWidth as number)
      .setClipHeight(json.clipHeight as number)
      .setWidth(json.width as number)
      .setHeight(json.height as number);
  }
}

import { SpriteManager } from "./SpriteManager";

Sprite.Manager = SpriteManager;
