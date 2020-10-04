"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera3D = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var Transform2D_1 = require("../Transform2D");
var Transform3D_1 = require("../Transform3D");
var math_1 = require("../../math");
var RenderableComponent_1 = require("../RenderableComponent");
var MAT4_0 = gl_matrix_1.mat4.create(), VEC2_0 = gl_matrix_1.vec2.create();
var Camera3D = /** @class */ (function (_super) {
    tslib_1.__extends(Camera3D, _super);
    function Camera3D() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 1.0;
        _this.height = 1.0;
        _this.aspect = 1.0;
        _this.orthographic = false;
        _this.size = 1;
        _this.minSize = Number.EPSILON;
        _this.maxSize = Infinity;
        _this.fov = 16;
        _this.near = math_1.EPSILON;
        _this.far = 1024;
        _this.projection = gl_matrix_1.mat4.identity(gl_matrix_1.mat4.create());
        _this.view = gl_matrix_1.mat4.identity(gl_matrix_1.mat4.create());
        _this.needsUpdate = true;
        _this.background = gl_matrix_1.vec4.create();
        return _this;
    }
    Camera3D.prototype.getBackground = function () {
        return this.background;
    };
    Camera3D.prototype.setBackground = function (background) {
        gl_matrix_1.vec4.copy(this.background, background);
        return this;
    };
    Camera3D.prototype.set = function (width, height) {
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
    Camera3D.prototype.getWidth = function () {
        return this.width;
    };
    Camera3D.prototype.setWidth = function (width) {
        return this.set(width, this.height);
    };
    Camera3D.prototype.getHeight = function () {
        return this.height;
    };
    Camera3D.prototype.setHeight = function (height) {
        return this.set(this.width, height);
    };
    Camera3D.prototype.getAspect = function () {
        return this.aspect;
    };
    Camera3D.prototype.getSize = function () {
        return this.size;
    };
    Camera3D.prototype.setSize = function (size) {
        this.size =
            size < this.minSize
                ? this.minSize
                : size > this.maxSize
                    ? this.maxSize
                    : size;
        return this.setNeedsUpdate();
    };
    Camera3D.prototype.getMinSize = function () {
        return this.minSize;
    };
    Camera3D.prototype.setMinSize = function (minSize) {
        this.minSize = minSize;
        return this.setNeedsUpdate();
    };
    Camera3D.prototype.getMaxSize = function () {
        return this.minSize;
    };
    Camera3D.prototype.setMaxSize = function (maxSize) {
        this.maxSize = maxSize;
        return this.setNeedsUpdate();
    };
    Camera3D.prototype.getFov = function () {
        return this.fov;
    };
    Camera3D.prototype.setFov = function (fov) {
        this.fov = fov;
        return this.setNeedsUpdate();
    };
    Camera3D.prototype.getNear = function () {
        return this.near;
    };
    Camera3D.prototype.setNear = function (near) {
        this.near = near;
        return this.setNeedsUpdate();
    };
    Camera3D.prototype.getFar = function () {
        return this.far;
    };
    Camera3D.prototype.setFar = function (far) {
        this.far = far;
        return this.setNeedsUpdate();
    };
    Camera3D.prototype.getView = function () {
        var _this = this;
        this.getEntity().ifSome(function (entity) {
            return TransformComponent_1.TransformComponent.getTransform(entity).ifSome(function (transform) {
                gl_matrix_1.mat4.invert(_this.view, transform.getMatrix4(MAT4_0));
            });
        });
        return this.view;
    };
    Camera3D.prototype.getProjection = function () {
        return this.updateProjectionIfNeeded().projection;
    };
    Camera3D.prototype.setNeedsUpdate = function (needsUpdate) {
        if (needsUpdate === void 0) { needsUpdate = true; }
        this.needsUpdate = needsUpdate;
        return this;
    };
    Camera3D.prototype.updateProjectionIfNeeded = function () {
        if (this.needsUpdate) {
            return this.updateProjection();
        }
        else {
            return this;
        }
    };
    Camera3D.prototype.isActive = function () {
        var _this = this;
        return this.getRequiredManager()
            .getActive()
            .map(function (active) { return active === _this; })
            .unwrapOr(false);
    };
    Camera3D.prototype.setActive = function () {
        this.getRequiredManager().setActive(this);
        return this;
    };
    Camera3D.prototype.updateProjection = function () {
        if (this.orthographic) {
            var right = this.size * this.aspect, left = -right, top_1 = this.size, bottom = -top_1;
            gl_matrix_1.mat4.ortho(this.projection, left, right, bottom, top_1, this.near, this.far);
        }
        else {
            gl_matrix_1.mat4.perspective(this.projection, this.fov, this.aspect, this.near, this.far);
        }
        this.needsUpdate = false;
        return this;
    };
    Camera3D.prototype.toRelative = function (out, screen) {
        this.toWorld(out, screen);
        gl_matrix_1.vec3.transformMat4(out, out, this.getView());
        return out;
    };
    Camera3D.prototype.toWorld = function (out, screen) {
        var mat = MAT4_0;
        out[0] = 2.0 * (screen[0] / this.width) - 1.0;
        out[1] = -2.0 * (screen[1] / this.height) + 1.0;
        out[2] = this.near;
        gl_matrix_1.mat4.mul(mat, this.projection, this.getView());
        gl_matrix_1.mat4.invert(mat, mat);
        gl_matrix_1.vec3.transformMat4(out, out, mat);
        return out;
    };
    Camera3D.prototype.toScreen = function (out, world) {
        var mat = gl_matrix_1.mat4.mul(MAT4_0, this.getProjection(), this.getView());
        VEC2_0[0] = world[0];
        VEC2_0[1] = world[1];
        gl_matrix_1.vec2.transformMat4(out, VEC2_0, mat);
        out[0] = (out[0] + 1.0) * 0.5 * this.width;
        out[1] = (1.0 - out[1]) * 0.5 * this.height;
        return out;
    };
    Camera3D.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { width: this.width, height: this.height, size: this.size, fov: this.fov, near: this.near, far: this.far, background: this.background });
    };
    Camera3D.prototype.fromJSON = function (json) {
        return _super.prototype.fromJSON.call(this, json)
            .set(json.width, json.height)
            .setSize(json.size)
            .setFov(json.fov)
            .setNear(json.near)
            .setFar(json.far)
            .setBackground(json.background);
    };
    Camera3D.requiredComponents = [[Transform2D_1.Transform2D, Transform3D_1.Transform3D]];
    return Camera3D;
}(RenderableComponent_1.RenderableComponent));
exports.Camera3D = Camera3D;
var TransformComponent_1 = require("../TransformComponent");
var Camera3DManager_1 = require("./Camera3DManager");
Camera3D.Manager = Camera3DManager_1.Camera3DManager;
