import { Time } from "../../plugins";
import { Component } from "../../sceneGraph";
import { SpriteClip } from "./SpriteClip";

export class SpriteSheet extends Component {
  static componentName = "engine.SpriteSheet";

  private currentTime: number = 0;
  private currentFrame: number = 0;
  private x: number = 0;
  private y: number = 0;
  private width: number = 1;
  private height: number = 1;
  private clips: SpriteClip[] = [];

  getClips() {
    return this.clips;
  }

  getX() {
    return this.x;
  }
  getY() {
    return this.y;
  }
  getWidth() {
    return this.width;
  }
  getHeight() {
    return this.height;
  }

  shouldUpdate() {
    return this.clips.length > 0;
  }

  onUpdate() {
    const clip = this.clips[this.currentFrame];

    if (clip) {
      this.x = clip.getX();
      this.y = clip.getY();
      this.width = clip.getWidth();
      this.height = clip.getHeight();

      if (this.currentTime >= clip.getDuration()) {
        this.currentTime = 0;
        this.currentFrame += 1;

        if (this.currentFrame >= this.clips.length) {
          this.currentFrame = 0;
        }
      }

      this.currentTime += this.getRequiredPlugin(Time).getScaledDelta();
    }

    return this;
  }
}
