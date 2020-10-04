"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sprite = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var plugins_1 = require("../../plugins");
var RenderableComponent_1 = require("../RenderableComponent");
var Sprite = /** @class */ (function (_super) {
    tslib_1.__extends(Sprite, _super);
    function Sprite() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.layer = 0;
        _this.imageAsset = core_1.none();
        _this.clipX = 0;
        _this.clipY = 0;
        _this.clipWidth = 1;
        _this.clipHeight = 1;
        _this.width = 1;
        _this.height = 1;
        _this.onImageLoadHandler = function () {
            _this.imageAsset.ifSome(function (imageAsset) {
                _this.clipWidth = imageAsset.getWidth();
                _this.clipHeight = imageAsset.getHeight();
                imageAsset.off("load", _this.onImageLoadHandler);
            });
        };
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
        this.imageAsset.replace(imageAsset);
        if (imageAsset.isLoaded()) {
            this.onImageLoadHandler();
        }
        else {
            imageAsset.on("load", this.onImageLoadHandler);
        }
        return this;
    };
    Sprite.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { imageAssetUUID: this.imageAsset
                .map(function (imageAsset) { return imageAsset.getUUID(); })
                .unwrapOr(null), layer: this.layer, clipX: this.clipX, clipY: this.clipY, clipWidth: this.clipWidth, clipHeight: this.clipHeight, width: this.width, height: this.height });
    };
    Sprite.prototype.fromJSON = function (json) {
        var _this = this;
        var onAddToScene = function () {
            _this.setImageAsset(_this.getRequiredPlugin(plugins_1.Assets)
                .getAsset(json.imageAssetUUID)
                .expect("Sprite.fromJSON Failed to get Asset " + json.imageAssetUUID));
            _this.off("add-to-scene", onAddToScene);
        };
        this.on("add-to-scene", onAddToScene);
        return _super.prototype.fromJSON.call(this, json)
            .setLayer(json.layer)
            .setClipX(json.clipX)
            .setClipY(json.clipY)
            .setClipWidth(json.clipWidth)
            .setClipHeight(json.clipHeight)
            .setWidth(json.width)
            .setHeight(json.height);
    };
    Sprite.requiredPlugins = [plugins_1.Assets];
    return Sprite;
}(RenderableComponent_1.RenderableComponent));
exports.Sprite = Sprite;
var SpriteManager_1 = require("./SpriteManager");
Sprite.Manager = SpriteManager_1.SpriteManager;
