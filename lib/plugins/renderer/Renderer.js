"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var json_1 = require("@aicacia/json");
var Plugin_1 = require("../../Plugin");
var Renderer = /** @class */ (function (_super) {
    tslib_1.__extends(Renderer, _super);
    function Renderer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rendererHandlers = [];
        _this.rendererHandlerMap = new Map();
        _this.sortRendererHandlersFunction = function (a, b) {
            return a.getRendererHandlerPriority() - b.getRendererHandlerPriority();
        };
        return _this;
    }
    Renderer.prototype.getRendererHandlers = function () {
        return this.rendererHandlers;
    };
    Renderer.prototype.getRendererHandler = function (RendererHandler) {
        return core_1.Option.from(this.rendererHandlerMap.get(RendererHandler));
    };
    Renderer.prototype.addRendererHandlers = function (rendererHandlers) {
        var _this = this;
        rendererHandlers.forEach(function (rendererHandler) {
            return _this._addRendererHandler(rendererHandler);
        });
        return this.sortRendererHandlers();
    };
    Renderer.prototype.addRendererHandler = function () {
        var rendererHandlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rendererHandlers[_i] = arguments[_i];
        }
        return this.addRendererHandlers(rendererHandlers);
    };
    Renderer.prototype.removeRendererHandlers = function (rendererHandlers) {
        var _this = this;
        rendererHandlers.forEach(function (rendererHandler) {
            return _this._removeRendererHandler(rendererHandler);
        });
        return this.sortRendererHandlers();
    };
    Renderer.prototype.removeRendererHandler = function () {
        var rendererHandlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rendererHandlers[_i] = arguments[_i];
        }
        return this.removeRendererHandlers(rendererHandlers);
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
    Renderer.prototype.sortRendererHandlers = function () {
        this.rendererHandlers.sort(this.sortRendererHandlersFunction);
        return this;
    };
    Renderer.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { rendererHandlers: this.rendererHandlers.map(function (rendererHandler) {
                return rendererHandler.toJSON();
            }) });
    };
    Renderer.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        if (json_1.isJSONArray(json.rendererHandlers)) {
            this.addRendererHandlers(json.rendererHandlers.map(function (json) {
                return RendererHandler_1.RendererHandler.newFromJSON(json);
            }));
        }
        return this;
    };
    Renderer.pluginPriority = Infinity;
    return Renderer;
}(Plugin_1.Plugin));
exports.Renderer = Renderer;
var RendererHandler_1 = require("./RendererHandler");
