import { Canvas } from "../Canvas";
import { RunOnUpdatePlugin } from "./RunOnUpdatePlugin";
import { Plugin, IRequirement } from "@aicacia/ecs";
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
