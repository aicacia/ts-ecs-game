import { none, Option, some } from "@aicacia/core";
import { ImageAsset } from "../../../plugins/assets/ImageAsset";

export class WebImageAsset extends ImageAsset {
  private image: Option<HTMLImageElement> = none();
  private src: string;

  constructor(src: string) {
    super();
    this.src = src;
  }

  getImage() {
    return this.image;
  }
  getWidth() {
    return this.image.map((image) => image.width).unwrapOr(0);
  }
  getHeight() {
    return this.image.map((image) => image.height).unwrapOr(0);
  }

  protected loadAsset() {
    return new Promise<void>((resolve, reject) => {
      const image = new Image();

      image.addEventListener("load", () => {
        this.image = some(image);
        resolve();
      });
      image.addEventListener("error", (error) => reject(error));
      image.src = this.src;
    });
  }

  protected unloadAsset() {
    this.image.clear();
    return Promise.resolve();
  }
}
