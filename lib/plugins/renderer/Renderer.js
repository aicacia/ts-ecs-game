"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var sceneGraph_1 = require("../../sceneGraph");
var Renderer = /** @class */ (function (_super) {
    tslib_1.__extends(Renderer, _super);
    function Renderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rendererHandlers = [];
        _this.rendererHandlerMap = new Map();
        return _this;
    }
    Renderer.prototype.getRendererHandlers = function () {
        return this.rendererHandlers;
    };
    Renderer.prototype.getRendererHandler = function (RendererHandler) {
        return core_1.Option.from(this.rendererHandlerMap.get(RendererHandler));
    };
    Renderer.prototype.addRendererHandlers = function () {
        var _this = this;
        var rendererHandlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rendererHandlers[_i] = arguments[_i];
        }
        rendererHandlers.forEach(function (rendererHandler) {
            return _this._addRendererHandler(rendererHandler);
        });
        return this;
    };
    Renderer.prototype.addRendererHandler = function () {
        var rendererHandlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rendererHandlers[_i] = arguments[_i];
        }
        return this.addRendererHandlers.apply(this, tslib_1.__spread(rendererHandlers));
    };
    Renderer.prototype.removeRendererHandlers = function () {
        var _this = this;
        var rendererHandlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rendererHandlers[_i] = arguments[_i];
        }
        rendererHandlers.forEach(function (rendererHandler) {
            return _this._removeRendererHandler(rendererHandler);
        });
        this.sort();
        return this;
    };
    Renderer.prototype.removeRendererHandler = function () {
        var rendererHandlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rendererHandlers[_i] = arguments[_i];
        }
        return this.removeRendererHandlers.apply(this, tslib_1.__spread(rendererHandlers));
    };
    Renderer.prototype.onUpdate = function () {
        this.rendererHandlers.forEach(function (rendererHandler) {
            if (rendererHandler.getEnabled()) {
                rendererHandler.onBeforeRender();
                rendererHandler.onRender();
            }
        });
        return this;
    };
    Renderer.prototype.onAfterUpdate = function () {
        this.rendererHandlers.forEach(function (rendererHandler) {
            if (rendererHandler.getEnabled()) {
                rendererHandler.onAfterRender();
            }
        });
        return this;
    };
    Renderer.prototype._addRendererHandler = function (rendererHandler) {
        var RendererHandler = rendererHandler.getConstructor();
        if (!this.rendererHandlerMap.has(RendererHandler)) {
            this.rendererHandlers.push(rendererHandler);
            this.rendererHandlerMap.set(RendererHandler, rendererHandler);
            rendererHandler.UNSAFE_setRenderer(this);
            rendererHandler.onAdd();
            this.emit("add-renderer_handler", rendererHandler);
        }
        return this;
    };
    Renderer.prototype._removeRendererHandler = function (RendererHandler) {
        var _this = this;
        this.getRendererHandler(RendererHandler).ifSome(function (rendererHandler) {
            _this.emit("remove-renderer_handler", rendererHandler);
            rendererHandler.onRemove();
            _this.rendererHandlers.splice(_this.rendererHandlers.indexOf(rendererHandler), 1);
            _this.rendererHandlerMap.delete(RendererHandler);
            rendererHandler.UNSAFE_removeRenderer();
        });
        return this;
    };
    Renderer.prototype.sort = function () {
        this.rendererHandlers.sort(this.sortFunction);
    };
    Renderer.prototype.sortFunction = function (a, b) {
        return a.getRendererHandlerPriority() - b.getRendererHandlerPriority();
    };
    Renderer.pluginPriority = Infinity;
    return Renderer;
}(sceneGraph_1.Plugin));
exports.Renderer = Renderer;
