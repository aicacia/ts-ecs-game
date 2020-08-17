/// <reference types="node" />
import { Option, IConstructor } from "@aicacia/core";
import { EventEmitter } from "events";
export declare abstract class RendererHandler<R extends Renderer = Renderer> extends EventEmitter {
    static rendererHandlerPriority: number;
    static getRendererHandlerPriority(): number;
    private renderer;
    private enabled;
    getEnabled(): boolean;
    setEnabled(enabled?: boolean): this;
    getConstructor(): IConstructor<this>;
    getRendererHandlerPriority(): number;
    UNSAFE_setRenderer(renderer: R): this;
    UNSAFE_removeRenderer(): this;
    getRenderer(): Option<R>;
    getRequiredRenderer(): R;
    getScene(): Option<import("../../sceneGraph").Scene>;
    getRequiredScene(): import("../../sceneGraph").Scene;
    getManager<M extends Manager>(Manager: IConstructor<M>): Option<M>;
    getRequiredManager<M extends Manager>(Manager: IConstructor<M>): M;
    getPlugin<P extends Plugin>(Plugin: new (...args: any[]) => P): Option<P>;
    getRequiredPlugin<P extends Plugin>(Plugin: new (...args: any[]) => P): P;
    onAdd(): this;
    onRemove(): this;
    onBeforeRender(): this;
    onRender(): this;
    onAfterRender(): this;
}
import { Manager, Plugin } from "../../sceneGraph";
import { Renderer } from "./Renderer";
