import { none, Option, some } from "@aicacia/core";
import { Asset } from "./Asset";

export class ImageAsset extends Asset {
  private image: Option<HTMLImageElement> = none();
  private src: string;

  constructor(src: string) {
    super();
    this.src = src;
  }

  getImage() {
    return this.image;
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
