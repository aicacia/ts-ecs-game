import { Canvas } from "../Canvas";
import { RunOnUpdatePlugin } from "./RunOnUpdatePlugin";
import { IRequirement } from "../IRequirement";
import { Plugin } from "../Plugin";
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
