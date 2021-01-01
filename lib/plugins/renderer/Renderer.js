"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const core_1 = require("@aicacia/core");
const json_1 = require("@aicacia/json");
const ecs_1 = require("@aicacia/ecs");
class Renderer extends ecs_1.Plugin {
    constructor() {
        super(...arguments);
        this.rendererHandlers = [];
        this.rendererHandlerMap = new Map();
        this.sortRendererHandlersFunction = (a, b) => {
            return a.getRendererHandlerPriority() - b.getRendererHandlerPriority();
        };
    }
    getRendererHandlers() {
        return this.rendererHandlers;
    }
    getRendererHandler(RendererHandler) {
        return core_1.Option.from(this.rendererHandlerMap.get(RendererHandler));
    }
    addRendererHandlers(rendererHandlers) {
        rendererHandlers.forEach((rendererHandler) => this._addRendererHandler(rendererHandler));
        return this.sortRendererHandlers();
    }
    addRendererHandler(...rendererHandlers) {
        return this.addRendererHandlers(rendererHandlers);
    }
    removeRendererHandlers(rendererHandlers) {
        rendererHandlers.forEach((rendererHandler) => this._removeRendererHandler(rendererHandler));
        return this.sortRendererHandlers();
    }
    removeRendererHandler(...rendererHandlers) {
        return this.removeRendererHandlers(rendererHandlers);
    }
    onUpdate() {
        this.rendererHandlers.forEach((rendererHandler) => {
            if (rendererHandler.getEnabled()) {
                rendererHandler.onBeforeRender();
                rendererHandler.onRender();
            }
        });
        return this;
    }
    onAfterUpdate() {
        this.rendererHandlers.forEach((rendererHandler) => {
            if (rendererHandler.getEnabled()) {
                rendererHandler.onAfterRender();
            }
        });
        return this;
    }
    _addRendererHandler(rendererHandler) {
        const RendererHandler = rendererHandler.getConstructor();
        if (!this.rendererHandlerMap.has(RendererHandler)) {
            this.rendererHandlers.push(rendererHandler);
            this.rendererHandlerMap.set(RendererHandler, rendererHandler);
            rendererHandler.UNSAFE_setRenderer(this);
            rendererHandler.onAdd();
            this.emit("add-renderer_handler", rendererHandler);
        }
        return this;
    }
    _removeRendererHandler(RendererHandler) {
        this.getRendererHandler(RendererHandler).ifSome((rendererHandler) => {
            this.emit("remove-renderer_handler", rendererHandler);
            rendererHandler.onRemove();
            this.rendererHandlers.splice(this.rendererHandlers.indexOf(rendererHandler), 1);
            this.rendererHandlerMap.delete(RendererHandler);
            rendererHandler.UNSAFE_removeRenderer();
        });
        return this;
    }
    sortRendererHandlers() {
        this.rendererHandlers.sort(this.sortRendererHandlersFunction);
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { rendererHandlers: this.rendererHandlers.map((rendererHandler) => rendererHandler.toJSON()) });
    }
    fromJSON(json) {
        super.fromJSON(json);
        if (json_1.isJSONArray(json.rendererHandlers)) {
            this.addRendererHandlers(json.rendererHandlers.map((json) => RendererHandler_1.RendererHandler.newFromJSON(json)));
        }
        return this;
    }
}
exports.Renderer = Renderer;
Renderer.pluginPriority = Infinity;
const RendererHandler_1 = require("./RendererHandler");
