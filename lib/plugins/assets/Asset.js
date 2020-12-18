"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
var tslib_1 = require("tslib");
var uuid_1 = require("uuid");
var ToFromJSONEventEmitter_1 = require("@aicacia/ecs/lib/ToFromJSONEventEmitter");
var Asset = /** @class */ (function (_super) {
    tslib_1.__extends(Asset, _super);
    function Asset() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.uuid = uuid_1.v4();
        _this.name = "";
        _this.loaded = false;
        _this.loading = false;
        return _this;
    }
    Asset.prototype.getUUID = function () {
        return this.uuid;
    };
    Asset.prototype.getName = function () {
        return this.name;
    };
    Asset.prototype.setName = function (name) {
        this.name = name;
        return this;
    };
    Asset.prototype.isLoaded = function () {
        return this.loaded;
    };
    Asset.prototype.isLoading = function () {
        return this.loading;
    };
    Asset.prototype.load = function () {
        var _this = this;
        if (this.loaded) {
            return Promise.resolve();
        }
        else {
            this.loading = true;
            return this.loadAsset()
                .then(function () {
                _this.loading = false;
                _this.loaded = true;
                _this.emit("load");
            })
                .catch(function (error) {
                _this.loading = true;
                _this.emit("load-error", error);
                throw error;
            });
        }
    };
    Asset.prototype.unload = function () {
        var _this = this;
        if (!this.loaded) {
            return Promise.resolve();
        }
        else {
            return this.unloadAsset()
                .then(function () {
                _this.loaded = false;
                _this.emit("unload");
            })
                .catch(function (error) {
                _this.emit("unload-error", error);
                throw error;
            });
        }
    };
    Asset.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { uuid: this.uuid, name: this.name });
    };
    Asset.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.uuid = json.uuid;
        this.name = json.name;
        return this;
    };
    return Asset;
}(ToFromJSONEventEmitter_1.ToFromJSONEventEmitter));
exports.Asset = Asset;
