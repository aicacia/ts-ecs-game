"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIElementManager = void 0;
var tslib_1 = require("tslib");
var Manager_1 = require("../../../Manager");
var UIElementManager = /** @class */ (function (_super) {
    tslib_1.__extends(UIElementManager, _super);
    function UIElementManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.layers = new Map();
        _this.sortFunction = function (a, b) {
            return a
                .getEntity()
                .flatMap(function (aEntity) {
                return b.getEntity().map(function (bEntity) { return aEntity.getDepth() - bEntity.getDepth(); });
            })
                .unwrapOr(0);
        };
        return _this;
    }
    UIElementManager.prototype.isEmpty = function () {
        return this.layers.size === 0;
    };
    UIElementManager.prototype.getLayers = function () {
        return Array.from(this.layers.entries()).sort(function (_a, _b) {
            var _c = tslib_1.__read(_a, 2), aLayer = _c[0], _aElements = _c[1];
            var _d = tslib_1.__read(_b, 2), bLayer = _d[0], _bElements = _d[1];
            return aLayer - bLayer;
        });
    };
    UIElementManager.prototype.getComponents = function () {
        var _a;
        return (_a = []).concat.apply(_a, tslib_1.__spread(this.getLayers().map(function (_a) {
            var _b = tslib_1.__read(_a, 2), _layer = _b[0], elements = _b[1];
            return elements;
        })));
    };
    UIElementManager.prototype.addComponent = function (uiElement) {
        this.getOrCreateLayer(uiElement.getLayer()).push(uiElement);
        return this;
    };
    UIElementManager.prototype.removeComponent = function (uiElement) {
        var layerIndex = uiElement.getLayer(), layer = this.layers.get(layerIndex);
        if (layer) {
            var index = layer.indexOf(uiElement);
            if (index !== -1) {
                layer.splice(index, 1);
                if (layer.length === 0) {
                    this.layers.delete(layerIndex);
                }
            }
        }
        return this;
    };
    UIElementManager.prototype.sort = function () {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(this.layers.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var layer = _c.value;
                layer.sort(this.sortFunction);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this;
    };
    UIElementManager.prototype.onInit = function () {
        return this;
    };
    UIElementManager.prototype.onUpdate = function () {
        return this;
    };
    UIElementManager.prototype.onAfterUpdate = function () {
        return this;
    };
    UIElementManager.prototype.getOrCreateLayer = function (layerIndex) {
        var layer = this.layers.get(layerIndex);
        if (layer) {
            return layer;
        }
        else {
            var newLayer = [];
            this.layers.set(layerIndex, newLayer);
            return newLayer;
        }
    };
    return UIElementManager;
}(Manager_1.Manager));
exports.UIElementManager = UIElementManager;
