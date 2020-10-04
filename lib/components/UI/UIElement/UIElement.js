"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIElement = void 0;
var tslib_1 = require("tslib");
var RenderableComponent_1 = require("../../RenderableComponent");
var Transform2D_1 = require("../../Transform2D");
var Transform3D_1 = require("../../Transform3D");
var UIElement = /** @class */ (function (_super) {
    tslib_1.__extends(UIElement, _super);
    function UIElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.dirty = true;
        _this.layer = 0;
        return _this;
    }
    UIElement.prototype.isDirty = function () {
        return this.dirty;
    };
    UIElement.prototype.setDirty = function (dirty) {
        if (dirty === void 0) { dirty = true; }
        this.dirty = !!dirty;
        return this;
    };
    UIElement.prototype.getLayer = function () {
        return this.layer;
    };
    UIElement.prototype.setLayer = function (layer) {
        var _this = this;
        var managerOption = this.getManager();
        managerOption.ifSome(function (manager) { return manager.removeComponent(_this); });
        this.layer = layer | 0;
        managerOption.ifSome(function (manager) { return manager.addComponent(_this); });
        return this;
    };
    UIElement.requiredComponents = [[Transform2D_1.Transform2D, Transform3D_1.Transform3D]];
    return UIElement;
}(RenderableComponent_1.RenderableComponent));
exports.UIElement = UIElement;
var UIElementManager_1 = require("./UIElementManager");
UIElement.Manager = UIElementManager_1.UIElementManager;
