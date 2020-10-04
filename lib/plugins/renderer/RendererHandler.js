"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RendererHandler = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var ToFromJSONEventEmitter_1 = require("../../ToFromJSONEventEmitter");
var RendererHandler = /** @class */ (function (_super) {
    tslib_1.__extends(RendererHandler, _super);
    function RendererHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderer = core_1.none();
        _this.enabled = true;
        return _this;
    }
    RendererHandler.getRendererHandlerPriority = function () {
        return this.rendererHandlerPriority;
    };
    RendererHandler.prototype.getEnabled = function () {
        return this.enabled;
    };
    RendererHandler.prototype.setEnabled = function (enabled) {
        if (enabled === void 0) { enabled = true; }
        this.enabled = enabled;
        return this;
    };
    RendererHandler.prototype.getConstructor = function () {
        return Object.getPrototypeOf(this).constructor;
    };
    RendererHandler.prototype.getRendererHandlerPriority = function () {
        return Object.getPrototypeOf(this).constructor.getRendererHandlerPriority();
    };
    RendererHandler.prototype.UNSAFE_setRenderer = function (renderer) {
        this.renderer.replace(renderer);
        return this;
    };
    RendererHandler.prototype.UNSAFE_removeRenderer = function () {
        this.renderer.clear();
        return this;
    };
    RendererHandler.prototype.getRenderer = function () {
        return this.renderer;
    };
    RendererHandler.prototype.getRequiredRenderer = function () {
        return this.renderer.expect(this.getConstructor() + " expected to be added to a Renderer first");
    };
    RendererHandler.prototype.getScene = function () {
        return this.getRenderer().flatMap(function (renderer) { return renderer.getScene(); });
    };
    RendererHandler.prototype.getRequiredScene = function () {
        return this.getScene().expect(this.getConstructor() + " required scene");
    };
    RendererHandler.prototype.getManager = function (Manager) {
        return this.getScene().flatMap(function (scene) { return scene.getManager(Manager); });
    };
    RendererHandler.prototype.getRequiredManager = function (Manager) {
        return this.getManager(Manager).expect(this.getConstructor() + " required " + Manager + " Manager");
    };
    RendererHandler.prototype.getPlugin = function (Plugin) {
        return this.getScene().flatMap(function (scene) { return scene.getPlugin(Plugin); });
    };
    RendererHandler.prototype.getRequiredPlugin = function (Plugin) {
        return this.getPlugin(Plugin).expect(this.getConstructor() + " required " + Plugin + " Plugin");
    };
    RendererHandler.prototype.onAdd = function () {
        return this;
    };
    RendererHandler.prototype.onRemove = function () {
        return this;
    };
    RendererHandler.prototype.onBeforeRender = function () {
        return this;
    };
    RendererHandler.prototype.onRender = function () {
        return this;
    };
    RendererHandler.prototype.onAfterRender = function () {
        return this;
    };
    RendererHandler.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { enabled: this.enabled });
    };
    RendererHandler.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.enabled = json.enabled;
        return this;
    };
    return RendererHandler;
}(ToFromJSONEventEmitter_1.ToFromJSONEventEmitter));
exports.RendererHandler = RendererHandler;
