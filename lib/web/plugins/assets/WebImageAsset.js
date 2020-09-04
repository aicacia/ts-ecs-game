"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebImageAsset = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var ImageAsset_1 = require("../../../plugins/assets/ImageAsset");
var WebImageAsset = /** @class */ (function (_super) {
    tslib_1.__extends(WebImageAsset, _super);
    function WebImageAsset(src) {
        var _this = _super.call(this) || this;
        _this.image = core_1.none();
        _this.src = src;
        return _this;
    }
    WebImageAsset.prototype.getImage = function () {
        return this.image;
    };
    WebImageAsset.prototype.getWidth = function () {
        return this.image.map(function (image) { return image.width; }).unwrapOr(0);
    };
    WebImageAsset.prototype.getHeight = function () {
        return this.image.map(function (image) { return image.height; }).unwrapOr(0);
    };
    WebImageAsset.prototype.loadAsset = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var image = new Image();
            image.addEventListener("load", function () {
                _this.image = core_1.some(image);
                resolve();
            });
            image.addEventListener("error", function (error) { return reject(error); });
            image.src = _this.src;
        });
    };
    WebImageAsset.prototype.unloadAsset = function () {
        this.image.clear();
        return Promise.resolve();
    };
    return WebImageAsset;
}(ImageAsset_1.ImageAsset));
exports.WebImageAsset = WebImageAsset;
