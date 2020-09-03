"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera2D = void 0;
var tslib_1 = require("tslib");
var Transform2D_1 = require("../Transform2D");
var Transform3D_1 = require("../Transform3D");
var gl_matrix_1 = require("gl-matrix");
var RenderableComponent_1 = require("../RenderableComponent");
var MAT2D_0 = gl_matrix_1.mat2d.create(), VEC2_0 = gl_matrix_1.vec2.create();
var Camera2D = /** @class */ (function (_super) {
    tslib_1.__extends(Camera2D, _super);
    function Camera2D() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 1.0;
        _this.height = 1.0;
        _this.aspect = 1.0;
        _this.size = 1;
        _this.minSize = Number.EPSILON;
        _this.maxSize = Infinity;
        _this.projection = gl_matrix_1.mat2d.identity(gl_matrix_1.mat2d.create());
        _this.view = gl_matrix_1.mat2d.identity(gl_matrix_1.mat2d.create());
        _this.needsUpdate = true;
        _this.background = gl_matrix_1.vec3.create();
        return _this;
    }
    Camera2D.prototype.getBackground = function () {
        return this.background;
    };
    Camera2D.prototype.setBackground = function (background) {
        gl_matrix_1.vec3.copy(this.background, background);
        return this;
    };
    Camera2D.prototype.set = function (width, height) {
        if (width !== this.width || height !== this.height) {
            this.width = width;
            this.height = height;
            this.aspect = width / height;
            return this.setNeedsUpdate();
        }
        else {
            return this;
        }
    };
    Camera2D.prototype.getWidth = function () {
        return this.width;
    };
    Camera2D.prototype.setWidth = function (width) {
        return this.set(width, this.height);
    };
    Camera2D.prototype.getHeight = function () {
        return this.height;
    };
    Camera2D.prototype.setHeight = function (height) {
        return this.set(this.width, height);
    };
    Camera2D.prototype.getAspect = function () {
        return this.aspect;
    };
    Camera2D.prototype.getSize = function () {
        return this.size;
    };
    Camera2D.prototype.setSize = function (size) {
        this.size =
            size < this.minSize
                ? this.minSize
                : size > this.maxSize
                    ? this.maxSize
                    : size;
        return this.setNeedsUpdate();
    };
    Camera2D.prototype.getMinSize = function () {
        return this.minSize;
    };
    Camera2D.prototype.setMinSize = function (minSize) {
        this.minSize = minSize;
        return this.setNeedsUpdate();
    };
    Camera2D.prototype.getMaxSize = function () {
        return this.minSize;
    };
    Camera2D.prototype.setMaxSize = function (maxSize) {
        this.maxSize = maxSize;
        return this.setNeedsUpdate();
    };
    Camera2D.prototype.getScale = function () {
        return this.getEntity()
            .flatMap(TransformComponent_1.TransformComponent.getTransform)
            .map(function (transform) {
            return gl_matrix_1.vec2.len(math_1.extractScale(VEC2_0, transform.getMatrix2d(MAT2D_0)));
        })
            .unwrapOr(1);
    };
    Camera2D.prototype.getView = function () {
        var _this = this;
        this.getEntity()
            .flatMap(TransformComponent_1.TransformComponent.getTransform)
            .ifSome(function (transform) {
            return gl_matrix_1.mat2d.invert(_this.view, transform.getMatrix2d(MAT2D_0));
        });
        return this.view;
    };
    Camera2D.prototype.getProjection = function () {
        return this.updateProjectionIfNeeded().projection;
    };
    Camera2D.prototype.setNeedsUpdate = function (needsUpdate) {
        if (needsUpdate === void 0) { needsUpdate = true; }
        this.needsUpdate = needsUpdate;
        return this;
    };
    Camera2D.prototype.updateProjectionIfNeeded = function () {
        if (this.needsUpdate) {
            return this.updateProjection();
        }
        else {
            return this;
        }
    };
    Camera2D.prototype.setActive = function () {
        this.getRequiredManager().setActive(this);
        return this;
    };
    Camera2D.prototype.updateProjection = function () {
        var size = this.getSize(), right = size * this.aspect, left = -right, top = size, bottom = -top, width = right - left, height = top - bottom, x = (right + left) / width, y = (top + bottom) / height;
        gl_matrix_1.mat2d.set(this.projection, 2 / width, 0.0, 0.0, 2 / height, -x, -y);
        this.needsUpdate = false;
        return this;
    };
    Camera2D.prototype.toRelative = function (out, screen) {
        this.toWorld(out, screen);
        gl_matrix_1.vec2.transformMat2d(out, out, this.view);
        return out;
    };
    Camera2D.prototype.toWorld = function (out, screen) {
        var mat = MAT2D_0;
        out[0] = 2.0 * (screen[0] / this.width) - 1.0;
        out[1] = -2.0 * (screen[1] / this.height) + 1.0;
        gl_matrix_1.mat2d.mul(mat, this.projection, this.view);
        gl_matrix_1.mat2d.invert(mat, mat);
        gl_matrix_1.vec2.transformMat2d(out, out, mat);
        return out;
    };
    Camera2D.prototype.toScreen = function (out, world) {
        var mat = gl_matrix_1.mat2d.mul(MAT2D_0, this.projection, this.view);
        gl_matrix_1.vec2.transformMat2d(out, world, mat);
        out[0] = (out[0] + 1.0) * 0.5 * this.width;
        out[1] = (1.0 - out[1]) * 0.5 * this.height;
        return out;
    };
    Camera2D.requiredComponents = [[Transform2D_1.Transform2D, Transform3D_1.Transform3D]];
    return Camera2D;
}(RenderableComponent_1.RenderableComponent));
exports.Camera2D = Camera2D;
var TransformComponent_1 = require("../TransformComponent");
var Camera2DManager_1 = require("./Camera2DManager");
var math_1 = require("../../math");
Camera2D.Manager = Camera2DManager_1.Camera2DManager;
