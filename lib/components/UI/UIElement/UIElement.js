"use strict";
exports.__esModule = true;
exports.UIElement = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var RenderableComponent_1 = require("../../RenderableComponent");
var MAT2D_0 = gl_matrix_1.mat2d.create(), VEC2_0 = gl_matrix_1.vec2.create(), VEC2_1 = gl_matrix_1.vec2.create();
var UIElement = /** @class */ (function (_super) {
    tslib_1.__extends(UIElement, _super);
    function UIElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 0;
        _this.height = 0;
        _this.layer = 0;
        return _this;
    }
    UIElement.prototype.getLocalAABB = function (min, max) {
        var _this = this;
        this.getEntity()
            .flatMap(TransformComponent_1.TransformComponent.getTransform)
            .ifSome(function (transform) {
            var matrix = transform.getMatrix2d(MAT2D_0), hw = _this.width * 0.5, hh = _this.height * 0.5;
            gl_matrix_1.vec2.set(min, -hw, -hh);
            gl_matrix_1.vec2.set(max, hw, hh);
            gl_matrix_1.vec2.transformMat2d(min, min, matrix);
            gl_matrix_1.vec2.transformMat2d(max, max, matrix);
        })
            .ifNone(function () {
            gl_matrix_1.vec2.set(min, 0, 0);
            gl_matrix_1.vec2.set(max, 0, 0);
        });
    };
    UIElement.prototype.getAABB = function (min, max) {
        var childMin = VEC2_0, childMax = VEC2_1;
        this.getLocalAABB(min, max);
        this.getRequiredEntity()
            .findAllWithComponent(UIElement, false)
            .forEach(function (element) {
            var childElement = element.getRequiredComponent(UIElement);
            childElement.getAABB(childMin, childMax);
            gl_matrix_1.vec2.min(min, min, childMin);
            gl_matrix_1.vec2.max(max, max, childMax);
        });
    };
    UIElement.prototype.getWidth = function () {
        return this.width;
    };
    UIElement.prototype.setWidth = function (width) {
        this.width = width;
        return this;
    };
    UIElement.prototype.getHeight = function () {
        return this.height;
    };
    UIElement.prototype.setHeight = function (height) {
        this.height = height;
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
    return UIElement;
}(RenderableComponent_1.RenderableComponent));
exports.UIElement = UIElement;
var TransformComponent_1 = require("../../TransformComponent");
var UIElementManager_1 = require("./UIElementManager");
UIElement.Manager = UIElementManager_1.UIElementManager;
