import { Plugin } from "../sceneGraph";
import { Canvas } from "../utils";
export interface FullScreenCanvas {
    on(event: "emit", listener: () => void): this;
}
export declare class FullScreenCanvas extends Plugin {
    private canvas;
    private window;
    constructor(canvas: Canvas);
    getCanvas(): Canvas;
    onAdd(): this;
    onRemove(): this;
    onResize: () => void;
}
