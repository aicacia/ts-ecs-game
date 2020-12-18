import { Manager } from "@aicacia/ecs/lib/Manager";
import type { Sprite } from "./Sprite";
export declare class SpriteManager extends Manager<Sprite> {
    private layers;
    isEmpty(): boolean;
    getComponents(): Sprite[];
    addComponent(sprite: Sprite): this;
    removeComponent(sprite: Sprite): this;
    sortFunction: (a: Sprite, b: Sprite) => number;
    sort(): this;
    onInit(): this;
    onUpdate(): this;
    onAfterUpdate(): this;
    private getOrCreateLayer;
}
