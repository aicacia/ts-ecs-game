"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
var tslib_1 = require("tslib");
var events_1 = require("events");
var Asset = /** @class */ (function (_super) {
    tslib_1.__extends(Asset, _super);
    function Asset() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = "";
        _this.loaded = false;
        _this.loading = false;
        return _this;
    }
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
    return Asset;
}(events_1.EventEmitter));
exports.Asset = Asset;
