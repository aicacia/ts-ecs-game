import { none, Option } from "@aicacia/core";
import { SpriteClip } from "./SpriteClip";
import { Component } from "@aicacia/ecs";
import { Time } from "../..";
import { Sprite } from "./Sprite";

export class SpriteSheet extends Component {
  static requiredComponents = [Sprite];
  static requiredPlugins = [Time];

  private currentTime = 0;
  private currentFrame = 0;
  private playBack = 1;
  private currentName: Option<string> = none();
  private spriteSheets: Record<string, SpriteClip[]> = {};

  get = (name: string) => {
    return Option.from(this.spriteSheets[name]);
  };
  set(name: string, spriteClips: SpriteClip[]) {
    this.spriteSheets[name] = spriteClips;
    return this;
  }
  getPlayBack() {
    return this.playBack;
  }
  setPlayBack(playBack: number) {
    this.playBack = playBack;
    return this;
  }
  setCurrent(name: string) {
    if (!this.spriteSheets.hasOwnProperty(name)) {
      throw new Error(
        `SpriteSheet setCurrent(name: string) no SpriteSheet found named ${name}`
      );
    }
    this.currentName.replace(name);
    this.currentFrame = 0;
    this.currentTime = 0;
    return this;
  }
  getCurrent() {
    return this.currentName.flatMap(this.get);
  }

  onUpdate() {
    this.getCurrent().ifSome((clips) => {
      const clip = clips[this.currentFrame];

      if (clip) {
        const sprite = this.getRequiredComponent(Sprite);

        sprite.setClipX(clip.getX());
        sprite.setClipY(clip.getY());
        sprite.setClipWidth(clip.getWidth());
        sprite.setClipHeight(clip.getHeight());

        if (this.currentTime >= clip.getDuration()) {
          this.currentTime = 0;
          this.currentFrame += 1;

          if (this.currentFrame >= clips.length) {
            this.currentFrame = 0;
          }
        }

        this.currentTime +=
          this.getRequiredPlugin(Time).getDelta() * this.playBack;
      }
    });

    return this;
  }
}
