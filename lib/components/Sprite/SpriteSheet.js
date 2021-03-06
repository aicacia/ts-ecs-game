"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteSheet = void 0;
const core_1 = require("@aicacia/core");
const ecs_1 = require("@aicacia/ecs");
const __1 = require("../..");
const Sprite_1 = require("./Sprite");
class SpriteSheet extends ecs_1.Component {
    constructor() {
        super(...arguments);
        this.currentTime = 0;
        this.currentFrame = 0;
        this.playBack = 1;
        this.currentName = core_1.none();
        this.spriteSheets = {};
        this.get = (name) => {
            return core_1.Option.from(this.spriteSheets[name]);
        };
    }
    set(name, spriteClips) {
        this.spriteSheets[name] = spriteClips;
        return this;
    }
    getPlayBack() {
        return this.playBack;
    }
    setPlayBack(playBack) {
        this.playBack = playBack;
        return this;
    }
    setCurrent(name) {
        if (!this.spriteSheets.hasOwnProperty(name)) {
            throw new Error(`SpriteSheet setCurrent(name: string) no SpriteSheet found named ${name}`);
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
                const sprite = this.getRequiredComponent(Sprite_1.Sprite);
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
                    this.getRequiredPlugin(__1.Time).getDelta() * this.playBack;
            }
        });
        return this;
    }
}
exports.SpriteSheet = SpriteSheet;
SpriteSheet.requiredComponents = [Sprite_1.Sprite];
SpriteSheet.requiredPlugins = [__1.Time];
