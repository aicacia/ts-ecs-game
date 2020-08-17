/// <reference types="node" />
import { EventEmitter } from "events";
export interface ICanvasOptions {
    disableContextMenu?: boolean;
}
export declare class Canvas extends EventEmitter {
    private canvas;
    private width;
    private height;
    constructor(options?: ICanvasOptions);
    getElement(): HTMLCanvasElement;
    getWidth(): number;
    getHeight(): number;
    set(width: number, height: number): this;
    getImageURI(): string;
    getStream(fps?: number): MediaStream;
}
