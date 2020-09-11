"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONAsset = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var Asset_1 = require("./Asset");
var JSONAsset = /** @class */ (function (_super) {
    tslib_1.__extends(JSONAsset, _super);
    function JSONAsset(src, options) {
        var _this = _super.call(this) || this;
        _this.json = core_1.none();
        _this.src = src;
        _this.options = options;
        return _this;
    }
    JSONAsset.prototype.getJSON = function () {
        return this.json;
    };
    JSONAsset.prototype.loadAsset = function () {
        var _this = this;
        return fetch(this.src, this.options)
            .then(function (response) { return response.json(); })
            .then(function (json) {
            _this.json.replace(json);
        });
    };
    JSONAsset.prototype.unloadAsset = function () {
        this.json.clear();
        return Promise.resolve();
    };
    return JSONAsset;
}(Asset_1.Asset));
exports.JSONAsset = JSONAsset;
