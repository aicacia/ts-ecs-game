"use strict";
exports.__esModule = true;
exports.ImageAsset = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var Asset_1 = require("./Asset");
var ImageAsset = /** @class */ (function (_super) {
    tslib_1.__extends(ImageAsset, _super);
    function ImageAsset(src) {
        var _this = _super.call(this) || this;
        _this.image = core_1.none();
        _this.src = src;
        return _this;
    }
    ImageAsset.prototype.getImage = function () {
        return this.image;
    };
    ImageAsset.prototype.loadAsset = function () {
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
    ImageAsset.prototype.unloadAsset = function () {
        this.image.clear();
        return Promise.resolve();
    };
    return ImageAsset;
}(Asset_1.Asset));
exports.ImageAsset = ImageAsset;
