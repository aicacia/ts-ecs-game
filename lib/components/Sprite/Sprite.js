"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprite = void 0;
var tslib_1 = require("tslib");
var RenderableComponent_1 = require("../RenderableComponent");
var Sprite = /** @class */ (function (_super) {
    tslib_1.__extends(Sprite, _super);
    function Sprite(imageAsset) {
        var _this = _super.call(this) || this;
        _this.layer = 0;
        _this.clipX = 0;
        _this.clipY = 0;
        _this.clipWidth = 1;
        _this.clipHeight = 1;
        _this.width = 1;
        _this.height = 1;
        _this.onImageLoadHandler = function () {
            _this.clipWidth = _this.imageAsset.getWidth();
            _this.clipHeight = _this.imageAsset.getHeight();
            _this.imageAsset.off("load", _this.onImageLoadHandler);
        };
        _this.imageAsset = imageAsset;
        if (_this.imageAsset.isLoaded()) {
            _this.onImageLoadHandler();
        }
        else {
            _this.imageAsset.on("load", _this.onImageLoadHandler);
        }
        return _this;
    }
    Sprite.prototype.getClipX = function () {
        return this.clipX;
    };
    Sprite.prototype.setClipX = function (clipX) {
        this.clipX = clipX;
        return this;
    };
    Sprite.prototype.getClipY = function () {
        return this.clipY;
    };
    Sprite.prototype.setClipY = function (clipY) {
        this.clipY = clipY;
        return this;
    };
    Sprite.prototype.getClipWidth = function () {
        return this.clipWidth;
    };
    Sprite.prototype.setClipWidth = function (clipWidth) {
        this.clipWidth = clipWidth;
        return this;
    };
    Sprite.prototype.getClipHeight = function () {
        return this.clipHeight;
    };
    Sprite.prototype.setClipHeight = function (clipHeight) {
        this.clipHeight = clipHeight;
        return this;
    };
    Sprite.prototype.getWidth = function () {
        return this.width;
    };
    Sprite.prototype.setWidth = function (width) {
        this.width = width;
        return this;
    };
    Sprite.prototype.getHeight = function () {
        return this.height;
    };
    Sprite.prototype.setHeight = function (height) {
        this.height = height;
        return this;
    };
    Sprite.prototype.getLayer = function () {
        return this.layer;
    };
    Sprite.prototype.setLayer = function (layer) {
        var _this = this;
        var managerOption = this.getManager();
        managerOption.ifSome(function (manager) { return manager.removeComponent(_this); });
        this.layer = layer | 0;
        managerOption.ifSome(function (manager) { return manager.addComponent(_this); });
        return this;
    };
    Sprite.prototype.getImageAsset = function () {
        return this.imageAsset;
    };
    Sprite.prototype.setImageAsset = function (imageAsset) {
        this.imageAsset = imageAsset;
        return this;
    };
    return Sprite;
}(RenderableComponent_1.RenderableComponent));
exports.Sprite = Sprite;
var SpriteManager_1 = require("./SpriteManager");
Sprite.Manager = SpriteManager_1.SpriteManager;
