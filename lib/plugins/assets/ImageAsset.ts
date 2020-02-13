import { none, Option } from "@aicacia/core";
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

  loadAsset(): Promise<void> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.addEventListener("load", () => {
        this.image.replace(image);
        resolve();
      });
      image.addEventListener("error", error => reject(error));
      image.src = this.src;
    });
  }

  unloadAsset(): Promise<void> {
    this.image.clear();
    return Promise.resolve();
  }
}
