"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteManager = void 0;
var tslib_1 = require("tslib");
var Manager_1 = require("../../Manager");
var SpriteManager = /** @class */ (function (_super) {
    tslib_1.__extends(SpriteManager, _super);
    function SpriteManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.layers = {};
        _this.sortFunction = function (a, b) {
            return a.getRequiredEntity().getDepth() - b.getRequiredEntity().getDepth();
        };
        return _this;
    }
    SpriteManager.prototype.isEmpty = function () {
        return Object.values(this.layers).length === 0;
    };
    SpriteManager.prototype.getComponents = function () {
        var _a;
        return (_a = []).concat.apply(_a, tslib_1.__spread(Object.values(this.layers)));
    };
    SpriteManager.prototype.addComponent = function (sprite) {
        this.getOrCreateLayer(sprite.getLayer()).push(sprite);
        return this;
    };
    SpriteManager.prototype.removeComponent = function (sprite) {
        var layerIndex = sprite.getLayer(), layer = this.layers[layerIndex];
        if (layer) {
            var index = layer.indexOf(sprite);
            if (index !== -1) {
                layer.splice(index, 1);
                if (layer.length === 0) {
                    delete this.layers[layerIndex];
                }
            }
        }
        return this;
    };
    SpriteManager.prototype.sort = function () {
        var _this = this;
        Object.values(this.layers).forEach(function (layer) {
            return layer.sort(_this.sortFunction);
        });
        return this;
    };
    SpriteManager.prototype.onInit = function () {
        return this;
    };
    SpriteManager.prototype.onUpdate = function () {
        return this;
    };
    SpriteManager.prototype.onAfterUpdate = function () {
        return this;
    };
    SpriteManager.prototype.getOrCreateLayer = function (layerIndex) {
        var layer = this.layers[layerIndex];
        if (layer) {
            return layer;
        }
        else {
            var newLayer = [];
            this.layers[layerIndex] = newLayer;
            return newLayer;
        }
    };
    return SpriteManager;
}(Manager_1.Manager));
exports.SpriteManager = SpriteManager;
