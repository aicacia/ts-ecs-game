"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Assets = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var json_1 = require("@aicacia/json");
var Plugin_1 = require("../../Plugin");
var Assets = /** @class */ (function (_super) {
    tslib_1.__extends(Assets, _super);
    function Assets() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.assetMap = {};
        _this.assets = [];
        _this.loadedAssets = [];
        _this.loadingPromises = new Map();
        _this.unloadingPromises = new Map();
        return _this;
    }
    Assets.prototype.find = function (fn) {
        return core_1.iter(this.assets).find(fn);
    };
    Assets.prototype.findWithName = function (name) {
        return this.find(function (asset) { return asset.getName() === name; });
    };
    Assets.prototype.findAll = function (fn) {
        return core_1.iter(this.assets).filter(fn).toArray();
    };
    Assets.prototype.findAllWithName = function (name) {
        return this.findAll(function (asset) { return asset.getName() === name; });
    };
    Assets.prototype.isLoading = function () {
        return this.loadingPromises.size > 0;
    };
    Assets.prototype.getAsset = function (uuid) {
        return core_1.Option.from(this.assetMap[uuid]);
    };
    Assets.prototype.getAssets = function () {
        return this.assets;
    };
    Assets.prototype.getLoadedAssets = function () {
        return this.loadedAssets;
    };
    Assets.prototype.getLoadingAssets = function () {
        return Array.from(this.loadingPromises.keys());
    };
    Assets.prototype.getUnloadingAssets = function () {
        return Array.from(this.unloadingPromises.keys());
    };
    Assets.prototype.getUnloadedAssets = function () {
        return this.assets.filter(function (asset) { return !asset.isLoaded(); });
    };
    Assets.prototype.addAsset = function () {
        var assets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            assets[_i] = arguments[_i];
        }
        return this.addAssets(assets);
    };
    Assets.prototype.addAssets = function (assets) {
        var _this = this;
        assets.forEach(function (asset) { return _this._addAsset(asset); });
        return this;
    };
    Assets.prototype.removeAsset = function () {
        var assets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            assets[_i] = arguments[_i];
        }
        return this.removeAssets(assets);
    };
    Assets.prototype.removeAssets = function (assets) {
        var _this = this;
        assets.forEach(function (asset) { return _this._removeAsset(asset); });
        return this;
    };
    Assets.prototype.loadAll = function () {
        return this.loadAssets(this.getUnloadedAssets());
    };
    Assets.prototype.loadAllInBackground = function () {
        return this.loadAssetsInBackground(this.getUnloadedAssets());
    };
    Assets.prototype.loadAssetInBackground = function () {
        var assets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            assets[_i] = arguments[_i];
        }
        return this.loadAssetsInBackground(assets);
    };
    Assets.prototype.loadAssetsInBackground = function (assets) {
        this.loadAssets(assets);
        return this;
    };
    Assets.prototype.unloadAssetInBackground = function () {
        var assets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            assets[_i] = arguments[_i];
        }
        return this.unloadAssetsInBackground(assets);
    };
    Assets.prototype.unloadAssetsInBackground = function (assets) {
        this.unloadAssets(assets);
        return this;
    };
    Assets.prototype.loadAsset = function () {
        var assets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            assets[_i] = arguments[_i];
        }
        return this.loadAssets(assets);
    };
    Assets.prototype.loadAssets = function (assets) {
        var _this = this;
        return Promise.all(assets.map(function (asset) { return _this._loadAsset(asset); }));
    };
    Assets.prototype.unloadAsset = function () {
        var assets = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            assets[_i] = arguments[_i];
        }
        return this.unloadAssets(assets);
    };
    Assets.prototype.unloadAssets = function (assets) {
        var _this = this;
        return Promise.all(assets.map(function (asset) { return _this._unloadAsset(asset); }));
    };
    Assets.prototype._loadAsset = function (asset) {
        var _this = this;
        if (asset.isLoaded()) {
            return Promise.resolve();
        }
        else {
            var promise = this.loadingPromises.get(asset);
            if (promise) {
                return promise;
            }
            else {
                var promise_1 = asset
                    .load()
                    .then(function () {
                    _this.loadingPromises.delete(asset);
                    _this.loadedAssets.push(asset);
                })
                    .catch(function (error) {
                    _this.loadingPromises.delete(asset);
                    throw error;
                });
                this.loadingPromises.set(asset, promise_1);
                return promise_1;
            }
        }
    };
    Assets.prototype._unloadAsset = function (asset) {
        var _this = this;
        if (!asset.isLoaded()) {
            return Promise.resolve();
        }
        else {
            var promise = this.unloadingPromises.get(asset);
            if (promise) {
                return promise;
            }
            else {
                var promise_2 = asset
                    .load()
                    .then(function () {
                    _this.unloadingPromises.delete(asset);
                    _this.loadedAssets.splice(_this.loadedAssets.indexOf(asset), 1);
                })
                    .catch(function (error) {
                    _this.unloadingPromises.delete(asset);
                    throw error;
                });
                this.unloadingPromises.set(asset, promise_2);
                return promise_2;
            }
        }
    };
    Assets.prototype._addAsset = function (asset) {
        var uuid = asset.getUUID();
        if (!this.assetMap[uuid]) {
            this.assetMap[uuid] = asset;
            this.assets.push(asset);
        }
        return this;
    };
    Assets.prototype._removeAsset = function (asset) {
        var uuid = asset.getUUID();
        if (this.assetMap[uuid]) {
            delete this.assetMap[uuid];
            this.assets.splice(this.assets.indexOf(asset), 1);
        }
        return this;
    };
    Assets.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { assets: this.assets.map(function (asset) { return asset.toJSON(); }) });
    };
    Assets.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        if (json_1.isJSONArray(json.assets)) {
            this.addAssets(json.assets.map(function (json) { return Asset_1.Asset.newFromJSON(json); }));
        }
        return this;
    };
    return Assets;
}(Plugin_1.Plugin));
exports.Assets = Assets;
var Asset_1 = require("./Asset");
