"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var events_1 = require("events");
var Component = /** @class */ (function (_super) {
    tslib_1.__extends(Component, _super);
    function Component() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.entity = core_1.none();
        _this.manager = core_1.none();
        return _this;
    }
    Component.getManagerConstructor = function () {
        if (!this.Manager) {
            throw new Error(this + " invalid Manager `" + this.Manager + "` " + this);
        }
        return this.Manager;
    };
    Component.getRequiredComponents = function () {
        return this.requiredComponents;
    };
    Component.getRequiredPlugins = function () {
        return this.requiredPlugins;
    };
    Component.prototype.getConstructor = function () {
        return Object.getPrototypeOf(this).constructor;
    };
    Component.prototype.getManagerConstructor = function () {
        return Object.getPrototypeOf(this).constructor.getManagerConstructor();
    };
    Component.prototype.getRequiredComponents = function () {
        return Object.getPrototypeOf(this).constructor.requiredComponents;
    };
    Component.prototype.getRequiredPlugins = function () {
        return Object.getPrototypeOf(this).constructor.requiredPlugins;
    };
    Component.prototype.getComponent = function (Component) {
        return this.getEntity().flatMap(function (entity) { return entity.getComponent(Component); });
    };
    Component.prototype.getRequiredComponent = function (Component) {
        return this.getComponent(Component).expect(this.getConstructor() + " Component requires " + Component + " Component");
    };
    Component.prototype.getPlugin = function (Plugin) {
        return this.getScene().flatMap(function (scene) { return scene.getPlugin(Plugin); });
    };
    Component.prototype.getRequiredPlugin = function (Plugin) {
        return this.getPlugin(Plugin).expect(this.getConstructor() + " Component requires " + Plugin + " Plugin");
    };
    Component.prototype.UNSAFE_setEntity = function (entity) {
        this.entity = core_1.some(entity);
        return this;
    };
    Component.prototype.UNSAFE_removeEntity = function () {
        this.entity = core_1.none();
        return this;
    };
    Component.prototype.getEntity = function () {
        return this.entity;
    };
    Component.prototype.getRequiredEntity = function () {
        return this.getEntity().expect(this.getConstructor() + " Component requires an Entity");
    };
    Component.prototype.getScene = function () {
        return this.entity.flatMap(function (entity) { return entity.getScene(); });
    };
    Component.prototype.getRequiredScene = function () {
        return this.getScene().expect(this.getConstructor() + " Component requires a Scene");
    };
    Component.prototype.UNSAFE_setManager = function (manager) {
        this.manager = core_1.some(manager);
        return this;
    };
    Component.prototype.UNSAFE_removeManager = function () {
        this.entity = core_1.none();
        return this;
    };
    Component.prototype.getManager = function () {
        return this.manager;
    };
    Component.prototype.getRequiredManager = function () {
        return this.getManager().expect(this.getConstructor() + " Component requires " + Object.getPrototypeOf(this).getManagerConstructor() + " Manager");
    };
    Component.prototype.onInit = function () {
        return this;
    };
    Component.prototype.onDetach = function () {
        return this;
    };
    Component.prototype.onAdd = function () {
        return this;
    };
    Component.prototype.onRemove = function () {
        return this;
    };
    Component.prototype.onUpdate = function () {
        return this;
    };
    Component.prototype.onAfterUpdate = function () {
        return this;
    };
    Component.prototype.toJSON = function () {
        return {
            type: this.getConstructor().name,
        };
    };
    Component.requiredComponents = [];
    Component.requiredPlugins = [];
    return Component;
}(events_1.EventEmitter));
exports.Component = Component;
var DefaultManager_1 = require("./DefaultManager");
Component.Manager = DefaultManager_1.DefaultManager;