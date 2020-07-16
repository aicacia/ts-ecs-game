import { RenderableComponent } from "../RenderableComponent";

export class Sprite extends RenderableComponent {
  private layer: number = 0;
  private imageAsset: ImageAsset;

  private currentTime: number = 0;
  private currentFrame: number = 0;
  private clipX: number = 0;
  private clipY: number = 0;
  private clipWidth: number = 1;
  private clipHeight: number = 1;
  private width: number = 1;
  private height: number = 1;
  private clips: SpriteClip[] = [];

  constructor(imageAsset: ImageAsset) {
    super();
    this.imageAsset = imageAsset;

    if (imageAsset.isLoaded()) {
      this.copyImageClipping();
    } else {
      imageAsset.on("load", () => {
        if (this.clips.length === 0) {
          this.copyImageClipping();
        }
      });
    }
  }

  getClips() {
    return this.clips;
  }

  getClipX() {
    return this.clipX;
  }
  getClipY() {
    return this.clipY;
  }
  getClipWidth() {
    return this.clipWidth;
  }
  getClipHeight() {
    return this.clipHeight;
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

  shouldUpdate() {
    return this.clips.length > 0;
  }

  getLayer() {
    return this.layer;
  }
  setLayer(layer: number) {
    const managerOption = this.getManager();
    managerOption.map((manager) => manager.removeComponent(this));
    this.layer = layer | 0;
    managerOption.map((manager) => manager.addComponent(this));
    return this;
  }

  getImage() {
    return this.imageAsset.getImage();
  }

  getImageAsset() {
    return this.imageAsset;
  }
  setImageAsset(imageAsset: ImageAsset) {
    this.imageAsset = imageAsset;
    return this;
  }

  onUpdate() {
    const clip = this.clips[this.currentFrame];

    if (clip) {
      this.clipX = clip.getX();
      this.clipY = clip.getY();
      this.clipWidth = clip.getWidth();
      this.clipHeight = clip.getHeight();

      if (this.currentTime >= clip.getDuration()) {
        this.currentTime = 0;
        this.currentFrame += 1;

        if (this.currentFrame >= this.clips.length) {
          this.currentFrame = 0;
        }
      }

      this.currentTime += this.getRequiredPlugin(Time).getDelta();
    }

    return this;
  }

  private copyImageClipping() {
    this.getImage().ifSome((img) => {
      this.clipWidth = img.width;
      this.clipHeight = img.height;
    });
  }
}

import { ImageAsset, Time } from "../../plugins";
import { SpriteClip } from "./SpriteClip";
import { SpriteManager } from "./SpriteManager";

Sprite.Manager = SpriteManager;
Sprite.requiredPlugins = [Time];
