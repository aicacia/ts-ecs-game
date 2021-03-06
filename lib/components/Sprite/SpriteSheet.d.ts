import { Option } from "@aicacia/core";
import { SpriteClip } from "./SpriteClip";
import { Component } from "@aicacia/ecs";
import { Time } from "../..";
import { Sprite } from "./Sprite";
export declare class SpriteSheet extends Component {
    static requiredComponents: (typeof Sprite)[];
    static requiredPlugins: (typeof Time)[];
    private currentTime;
    private currentFrame;
    private playBack;
    private currentName;
    private spriteSheets;
    get: (name: string) => Option<SpriteClip[]>;
    set(name: string, spriteClips: SpriteClip[]): this;
    getPlayBack(): number;
    setPlayBack(playBack: number): this;
    setCurrent(name: string): this;
    getCurrent(): Option<SpriteClip[]>;
    onUpdate(): this;
}
