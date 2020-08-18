"use strict";
exports.__esModule = true;
exports.Plugin = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var events_1 = require("events");
var Plugin = /** @class */ (function (_super) {
    tslib_1.__extends(Plugin, _super);
    function Plugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scene = core_1.none();
        return _this;
    }
    Plugin.getPluginPriority = function () {
        return this.pluginPriority;
    };
    Plugin.getRequiredPlugins = function () {
        return this.requiredPlugins;
    };
    Plugin.prototype.getConstructor = function () {
        return Object.getPrototypeOf(this).constructor;
    };
    Plugin.prototype.getPluginPriority = function () {
        return Object.getPrototypeOf(this).constructor.getPluginPriority();
    };
    Plugin.prototype.getRequiredPlugins = function () {
        return Object.getPrototypeOf(this).constructor.requiredPlugins;
    };
    Plugin.prototype.getPlugin = function (Plugin) {
        return this.getScene().flatMap(function (scene) { return scene.getPlugin(Plugin); });
    };
    Plugin.prototype.getRequiredPlugin = function (Plugin) {
        return this.getPlugin(Plugin).expect(this.getConstructor() + " required " + Plugin + " Plugin");
    };
    Plugin.prototype.getManager = function (Manager) {
        return this.getScene().flatMap(function (scene) { return scene.getManager(Manager); });
    };
    Plugin.prototype.getRequiredManager = function (Manager) {
        return this.getManager(Manager).expect(this.getConstructor() + " required " + Manager + " Manager");
    };
    Plugin.prototype.validateRequirements = function () {
        var e_1, _a;
        var _this = this;
        var missingPlugins = [];
        try {
            for (var _b = tslib_1.__values(this.getRequiredScene().getPlugins()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var plugin = _c.value;
                utils_1.filterRequirements(missingPlugins, plugin.getRequiredPlugins(), function (P) { return !_this.getRequiredScene().hasPlugin(P); });
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (missingPlugins.length > 0) {
            var pluginMessage = missingPlugins.map(function (missingRequirement) {
                return _this.getConstructor() + " Plugin requires " + IRequirement_1.requirementToString(missingRequirement) + " Plugin";
            });
            throw new Error(pluginMessage.join("\n"));
        }
    };
    Plugin.prototype.UNSAFE_setScene = function (scene) {
        this.scene = core_1.some(scene);
        return this;
    };
    Plugin.prototype.UNSAFE_removeScene = function () {
        this.scene = core_1.none();
        return this;
    };
    Plugin.prototype.getScene = function () {
        return this.scene;
    };
    Plugin.prototype.getRequiredScene = function () {
        return this.getScene().expect(this.getConstructor() + " required a Scene");
    };
    Plugin.prototype.onInit = function () {
        return this;
    };
    Plugin.prototype.onAdd = function () {
        return this;
    };
    Plugin.prototype.onRemove = function () {
        return this;
    };
    Plugin.prototype.onAfterUpdate = function () {
        return this;
    };
    Plugin.prototype.onUpdate = function () {
        return this;
    };
    Plugin.pluginPriority = 0;
    Plugin.requiredPlugins = [];
    return Plugin;
}(events_1.EventEmitter));
exports.Plugin = Plugin;
var utils_1 = require("../utils");
var IRequirement_1 = require("../utils/IRequirement");