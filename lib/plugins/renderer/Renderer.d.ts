import { Option, IConstructor } from "@aicacia/core";
import { Plugin } from "../../sceneGraph";
export declare abstract class Renderer extends Plugin {
    static pluginPriority: number;
    private rendererHandlers;
    private rendererHandlerMap;
    getRendererHandlers(): RendererHandler<Renderer>[];
    getRendererHandler<R extends RendererHandler>(RendererHandler: IConstructor<R>): Option<RendererHandler<Renderer>>;
    addRendererHandlers(...rendererHandlers: RendererHandler[]): this;
    addRendererHandler(...rendererHandlers: RendererHandler[]): this;
    removeRendererHandlers(...rendererHandlers: IConstructor<RendererHandler>[]): this;
    removeRendererHandler(...rendererHandlers: IConstructor<RendererHandler>[]): this;
    onUpdate(): this;
    onAfterUpdate(): this;
    private _addRendererHandler;
    private _removeRendererHandler;
    private sort;
    private sortFunction;
}
import { RendererHandler } from "./RendererHandler";
