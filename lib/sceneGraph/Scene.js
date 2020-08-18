"use strict";
exports.__esModule = true;
exports.Scene = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var events_1 = require("events");
var Scene = /** @class */ (function (_super) {
    tslib_1.__extends(Scene, _super);
    function Scene() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.entities = [];
        _this.entitiesToAdd = [];
        _this.entitiesToRemove = [];
        _this.managers = [];
        _this.managerMap = new Map();
        _this.plugins = [];
        _this.pluginsMap = new Map();
        _this.isUpdating = false;
        _this.isInitted = false;
        return _this;
    }
    Scene.prototype.maintain = function () {
        var _this = this;
        this.emit("maintain");
        this.entitiesToAdd.forEach(function (entity) { return _this.addEntityNow(entity, true); });
        this.entitiesToAdd.length = 0;
        this.entitiesToRemove.forEach(function (entity) {
            return _this.removeEntityNow(entity, true);
        });
        this.entitiesToRemove.length = 0;
        return this;
    };
    Scene.prototype.update = function () {
        this.isUpdating = true;
        this.emit("update");
        this.maintain();
        if (!this.isInitted) {
            this.isInitted = true;
            this.plugins.forEach(function (plugin) { return plugin.onInit(); });
        }
        this.plugins.forEach(function (plugin) { return plugin.onUpdate(); });
        this.managers.forEach(function (manager) { return manager.onUpdate(); });
        this.managers.forEach(function (manager) { return manager.onAfterUpdate(); });
        this.plugins.forEach(function (plugin) { return plugin.onAfterUpdate(); });
        this.isUpdating = false;
        return this;
    };
    Scene.prototype.find = function (fn, recur) {
        var e_1, _a;
        if (recur === void 0) { recur = true; }
        var entities = this.getEntities();
        try {
            for (var entities_1 = tslib_1.__values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
                var entity = entities_1_1.value;
                if (fn(entity)) {
                    return core_1.some(entity);
                }
                else if (recur) {
                    var found = entity.find(fn, recur);
                    if (found.isSome()) {
                        return found;
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (entities_1_1 && !entities_1_1.done && (_a = entities_1["return"])) _a.call(entities_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return core_1.none();
    };
    Scene.prototype.findWithTag = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        return this.find(function (entity) { return entity.hasTags(tags); });
    };
    Scene.prototype.findWithTags = function (tags) {
        return this.findWithTag.apply(this, tslib_1.__spread(tags));
    };
    Scene.prototype.findWithName = function (name) {
        return this.find(function (entity) { return entity.getName() === name; });
    };
    Scene.prototype.findAll = function (fn, recur) {
        var e_2, _a;
        if (recur === void 0) { recur = true; }
        var entities = this.getEntities(), matching = [];
        try {
            for (var entities_2 = tslib_1.__values(entities), entities_2_1 = entities_2.next(); !entities_2_1.done; entities_2_1 = entities_2.next()) {
                var entity = entities_2_1.value;
                if (fn(entity)) {
                    matching.push(entity);
                }
                else if (recur) {
                    matching.push.apply(matching, tslib_1.__spread(entity.findAll(fn, recur)));
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (entities_2_1 && !entities_2_1.done && (_a = entities_2["return"])) _a.call(entities_2);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return matching;
    };
    Scene.prototype.findAllWithTag = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        return this.findAll(function (entity) { return entity.hasTags(tags); });
    };
    Scene.prototype.findAllWithTags = function (tags) {
        return this.findAllWithTag.apply(this, tslib_1.__spread(tags));
    };
    Scene.prototype.findAllWithName = function (name) {
        return this.findAll(function (entity) { return entity.getName() === name; });
    };
    Scene.prototype.getEntities = function () {
        return this.entities;
    };
    Scene.prototype.getManagers = function () {
        return this.managers;
    };
    Scene.prototype.getManager = function (Manager) {
        return core_1.Option.from(this.managerMap.get(Manager));
    };
    Scene.prototype.getRequiredManager = function (Manager) {
        return this.getManager(Manager).expect("Scene required " + Manager + " Manager");
    };
    Scene.prototype.getPlugins = function () {
        return this.plugins;
    };
    Scene.prototype.hasPlugin = function (Plugin) {
        return this.getPlugin(Plugin).isSome();
    };
    Scene.prototype.getPlugin = function (Plugin) {
        return core_1.Option.from(this.pluginsMap.get(Plugin));
    };
    Scene.prototype.getRequiredPlugin = function (Plugin) {
        return this.getPlugin(Plugin).expect("Scene required " + Plugin + " Plugin");
    };
    Scene.prototype.addPlugins = function (plugins) {
        var _this = this;
        plugins.forEach(function (plugin) { return _this._addPlugin(plugin); });
        this.sortPlugins();
        return this;
    };
    Scene.prototype.addPlugin = function () {
        var plugins = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            plugins[_i] = arguments[_i];
        }
        return this.addPlugins(plugins);
    };
    Scene.prototype.removePlugins = function (plugins) {
        var _this = this;
        plugins.forEach(function (plugin) { return _this._removePlugin(plugin); });
        return this;
    };
    Scene.prototype.removePlugin = function () {
        var plugins = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            plugins[_i] = arguments[_i];
        }
        return this.removePlugins(plugins);
    };
    Scene.prototype.addEntities = function (entities) {
        var _a;
        (_a = this.entitiesToAdd).push.apply(_a, tslib_1.__spread(entities));
        return this;
    };
    Scene.prototype.addEntity = function () {
        var entities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            entities[_i] = arguments[_i];
        }
        return this.addEntities(entities);
    };
    Scene.prototype.removeEntities = function (entities) {
        var _a;
        (_a = this.entitiesToRemove).push.apply(_a, tslib_1.__spread(entities));
        return this;
    };
    Scene.prototype.removeEntity = function () {
        var entities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            entities[_i] = arguments[_i];
        }
        return this.removeEntities(entities);
    };
    Scene.prototype.addEntityNow = function (entity, force) {
        if (force === void 0) { force = false; }
        if (this.isUpdating && !force) {
            throw new Error("Scene.addEntityNow called while updating, use force to suppress this Error");
        }
        return this._addEntityNow(entity, false);
    };
    Scene.prototype.removeEntityNow = function (entity, force) {
        var _this = this;
        if (force === void 0) { force = false; }
        if (this.isUpdating && !force) {
            throw new Error("Scene.removeEntityNow called while updating, use force to suppress this Error");
        }
        entity
            .getComponents()
            .forEach(function (component) { return _this.UNSAFE_removeComponent(component); });
        if (entity.isRoot()) {
            var index = this.entities.indexOf(entity);
            if (index !== -1) {
                this.entities.splice(index, 1);
                entity.UNSAFE_removeScene();
            }
        }
        else {
            entity.getParent().map(function (parent) { return parent.removeChild(entity); });
        }
        entity.getChildren().forEach(function (child) { return _this.removeEntityNow(child, true); });
        this.emit("remove-entity", entity);
        return this;
    };
    Scene.prototype.UNSAFE_addComponent = function (component) {
        var Manager = component.getManagerConstructor();
        var managerOption = this.getManager(Manager), manager;
        if (managerOption.isNone()) {
            manager = new Manager();
            managerOption = core_1.some(manager);
            manager.UNSAFE_setScene(this);
            this.managers.push(manager);
            this.managerMap.set(Manager, manager);
            this.sortManagers();
            manager.onAdd();
        }
        else {
            manager = managerOption.unwrap();
        }
        manager.addComponent(component);
        component.UNSAFE_setManager(manager);
        manager.sort();
        component.onAdd();
        this.emit("add-component", component);
        return this;
    };
    Scene.prototype.UNSAFE_removeComponent = function (component) {
        var _this = this;
        var Manager = component.getManagerConstructor();
        var managerOption = this.getManager(Manager);
        this.emit("remove-component", component);
        managerOption.ifSome(function (manager) {
            component.onRemove();
            manager.removeComponent(component);
            component.UNSAFE_removeManager();
            if (manager.isEmpty()) {
                manager.onRemove();
                _this.managers.splice(_this.managers.indexOf(manager), 1);
                _this.managerMap["delete"](Manager);
            }
        });
        return this;
    };
    Scene.prototype._addEntityNow = function (entity, isChild) {
        var _this = this;
        entity.getScene().map(function (scene) { return scene.removeEntityNow(entity, true); });
        if (entity.isRoot()) {
            this.entities.push(entity);
        }
        else if (!isChild) {
            throw new Error("Scene trying to add an Entity that has a parent to the Scene");
        }
        entity.UNSAFE_setScene(this);
        entity
            .getComponents()
            .forEach(function (component) { return _this.UNSAFE_addComponent(component); });
        entity.getChildren().forEach(function (child) { return _this._addEntityNow(child, true); });
        if (process.env.NODE_ENV !== "production") {
            entity.validateRequirements();
        }
        this.emit("add-entity", entity);
        return this;
    };
    Scene.prototype._addPlugin = function (plugin) {
        var Plugin = plugin.getConstructor(), index = this.plugins.indexOf(plugin);
        if (index === -1) {
            this.plugins.push(plugin);
            this.pluginsMap.set(Plugin, plugin);
            plugin.UNSAFE_setScene(this);
            if (this.isInitted) {
                plugin.onInit();
            }
            plugin.onAdd();
            if (process.env.NODE_ENV !== "production") {
                plugin.validateRequirements();
            }
            this.sortPlugins();
            this.emit("add-plugin", plugin);
        }
        return this;
    };
    Scene.prototype._removePlugin = function (Plugin) {
        var _this = this;
        var pluginOption = this.getPlugin(Plugin);
        pluginOption.ifSome(function (plugin) {
            _this.emit("remove-plugin", plugin);
            plugin.onRemove();
            plugin.UNSAFE_removeScene();
            _this.plugins.splice(_this.plugins.indexOf(plugin), 1);
            _this.pluginsMap["delete"](Plugin);
        });
        return this;
    };
    Scene.prototype.sortPlugins = function () {
        this.plugins.sort(this.pluginSortFunction);
    };
    Scene.prototype.pluginSortFunction = function (a, b) {
        return a.getPluginPriority() - b.getPluginPriority();
    };
    Scene.prototype.sortManagers = function () {
        this.managers.sort(this.managerSortFunction);
    };
    Scene.prototype.managerSortFunction = function (a, b) {
        return a.getManagerPriority() - b.getManagerPriority();
    };
    return Scene;
}(events_1.EventEmitter));
exports.Scene = Scene;