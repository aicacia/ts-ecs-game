import { Canvas } from "../Canvas";
import { RunOnUpdatePlugin } from "./RunOnUpdatePlugin";
import { IRequirement } from "@aicacia/ecs/lib/IRequirement";
import { Plugin } from "@aicacia/ecs/lib/Plugin";
export declare class FullScreenCanvas extends RunOnUpdatePlugin {
    static toFromJSONEnabled: boolean;
    static requiredPlugins: IRequirement<Plugin>[];
    private canvas;
    constructor(canvas: Canvas);
    getCanvas(): Canvas;
    onAdd(): this;
    onRemove(): this;
    private onResizeEventListener;
    private onResize;
}
