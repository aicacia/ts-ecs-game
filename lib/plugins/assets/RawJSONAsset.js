"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RawJSONAsset = void 0;
var tslib_1 = require("tslib");
var Asset_1 = require("./Asset");
var RawJSONAsset = /** @class */ (function (_super) {
    tslib_1.__extends(RawJSONAsset, _super);
    function RawJSONAsset(json) {
        var _this = _super.call(this) || this;
        _this.json = json;
        return _this;
    }
    RawJSONAsset.prototype.getJSON = function () {
        return this.json;
    };
    RawJSONAsset.prototype.loadAsset = function () {
        return Promise.resolve();
    };
    RawJSONAsset.prototype.unloadAsset = function () {
        return Promise.resolve();
    };
    RawJSONAsset.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { json: this.json });
    };
    RawJSONAsset.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.json = json.json;
        return this;
    };
    return RawJSONAsset;
}(Asset_1.Asset));
exports.RawJSONAsset = RawJSONAsset;
