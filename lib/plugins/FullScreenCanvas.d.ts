import { Canvas } from "../utils";
import { RunOnUpdatePlugin } from "./RunOnUpdatePlugin";
import { IRequirement, Plugin } from "../sceneGraph";
export interface FullScreenCanvas {
    on(event: "emit", listener: () => void): this;
}
export declare class FullScreenCanvas extends RunOnUpdatePlugin {
    static requiredPlugins: IRequirement<Plugin>[];
    private canvas;
    constructor(canvas: Canvas);
    getCanvas(): Canvas;
    onAdd(): this;
    onRemove(): this;
    private onResize;
    private runOnResizeFn;
}
