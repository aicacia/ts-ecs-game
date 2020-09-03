"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform2D = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var math_1 = require("../../math");
var TransformComponent_1 = require("../TransformComponent");
var Transform2DManager_1 = require("./Transform2DManager");
var VEC2_0 = gl_matrix_1.vec2.create(), VEC3_UP = gl_matrix_1.vec3.fromValues(0, 0, 1), MAT2_0 = gl_matrix_1.mat2d.create();
var Transform2D = /** @class */ (function (_super) {
    tslib_1.__extends(Transform2D, _super);
    function Transform2D() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.localPosition = gl_matrix_1.vec2.create();
        _this.localScale = gl_matrix_1.vec2.fromValues(1, 1);
        _this.localRotation = 0.0;
        _this.localMatrix = gl_matrix_1.mat2d.create();
        _this.position = gl_matrix_1.vec2.create();
        _this.scale = gl_matrix_1.vec2.fromValues(1, 1);
        _this.rotation = 0.0;
        _this.matrix = gl_matrix_1.mat2d.create();
        return _this;
    }
    Transform2D.prototype.getLocalPosition2 = function (out) {
        return gl_matrix_1.vec2.copy(out, this.getLocalPosition());
    };
    Transform2D.prototype.getLocalPosition3 = function (out) {
        var localPosition = this.getLocalPosition();
        out[0] = localPosition[0];
        out[1] = localPosition[1];
        return out;
    };
    Transform2D.prototype.setLocalPosition2 = function (localPosition) {
        return this.setLocalPosition(localPosition);
    };
    Transform2D.prototype.setLocalPosition3 = function (localPosition) {
        return this.setLocalPosition(gl_matrix_1.vec2.set(VEC2_0, localPosition[0], localPosition[1]));
    };
    Transform2D.prototype.getPosition2 = function (out) {
        return gl_matrix_1.vec2.copy(out, this.getPosition());
    };
    Transform2D.prototype.getPosition3 = function (out) {
        var position = this.getPosition();
        out[0] = position[0];
        out[1] = position[1];
        return out;
    };
    Transform2D.prototype.getLocalRotationZ = function () {
        return this.getLocalRotation();
    };
    Transform2D.prototype.getLocalRotationQuat = function (out) {
        return gl_matrix_1.quat.fromEuler(out, 0, 0, this.getLocalRotation());
    };
    Transform2D.prototype.setLocalRotationZ = function (localRotation) {
        return this.setLocalRotation(localRotation);
    };
    Transform2D.prototype.setLocalRotationQuat = function (localRotation) {
        return this.setLocalRotation(gl_matrix_1.quat.getAxisAngle(VEC3_UP, localRotation));
    };
    Transform2D.prototype.getRotationZ = function () {
        return this.getRotation();
    };
    Transform2D.prototype.getRotationQuat = function (out) {
        return gl_matrix_1.quat.fromEuler(out, 0, 0, this.getRotation());
    };
    Transform2D.prototype.getLocalScale2 = function (out) {
        return gl_matrix_1.vec2.copy(out, this.getLocalScale());
    };
    Transform2D.prototype.getLocalScale3 = function (out) {
        var localScale = this.getLocalScale();
        out[0] = localScale[0];
        out[1] = localScale[1];
        return out;
    };
    Transform2D.prototype.setLocalScale2 = function (localScale) {
        return this.setLocalScale(localScale);
    };
    Transform2D.prototype.setLocalScale3 = function (localScale) {
        return this.setLocalScale(gl_matrix_1.vec2.set(VEC2_0, localScale[0], localScale[1]));
    };
    Transform2D.prototype.getScale2 = function (out) {
        return gl_matrix_1.vec2.copy(out, this.getScale());
    };
    Transform2D.prototype.getScale3 = function (out) {
        var scale = this.getScale();
        out[0] = scale[0];
        out[1] = scale[1];
        return out;
    };
    Transform2D.prototype.setLocalPosition = function (localPosition) {
        gl_matrix_1.vec2.copy(this.localPosition, localPosition);
        return this.setNeedsUpdate();
    };
    Transform2D.prototype.getPosition = function () {
        return this.updateMatrixIfNeeded().position;
    };
    Transform2D.prototype.getLocalPosition = function () {
        return this.localPosition;
    };
    Transform2D.prototype.setLocalScale = function (localScale) {
        gl_matrix_1.vec2.copy(this.localScale, localScale);
        return this.setNeedsUpdate();
    };
    Transform2D.prototype.getScale = function () {
        return this.updateMatrixIfNeeded().scale;
    };
    Transform2D.prototype.getLocalScale = function () {
        return this.localScale;
    };
    Transform2D.prototype.setLocalRotation = function (localRotation) {
        this.localRotation = localRotation;
        return this.setNeedsUpdate();
    };
    Transform2D.prototype.getRotation = function () {
        return this.updateMatrixIfNeeded().rotation;
    };
    Transform2D.prototype.getLocalRotation = function () {
        return this.localRotation;
    };
    Transform2D.prototype.getMatrix = function () {
        return this.updateMatrixIfNeeded().matrix;
    };
    Transform2D.prototype.getLocalMatrix = function () {
        return this.updateLocalMatrixIfNeeded().localMatrix;
    };
    Transform2D.prototype.updateLocalMatrix = function () {
        math_1.composeMat2d(this.localMatrix, this.localPosition, this.localScale, this.localRotation);
        return this;
    };
    Transform2D.prototype.updateMatrix = function () {
        var _this = this;
        this.updateLocalMatrixIfNeeded()
            .getParentTransform()
            .mapOrElse(function (parentTransform) {
            gl_matrix_1.mat2d.mul(_this.matrix, parentTransform.getMatrix2d(MAT2_0), _this.localMatrix);
            _this.rotation = math_1.decomposeMat2d(_this.matrix, _this.position, _this.scale);
        }, function () {
            gl_matrix_1.mat2d.copy(_this.matrix, _this.localMatrix);
            gl_matrix_1.vec2.copy(_this.position, _this.localPosition);
            gl_matrix_1.vec2.copy(_this.scale, _this.localScale);
            _this.rotation = _this.localRotation;
        });
        return this;
    };
    Transform2D.prototype.getMatrix4 = function (out) {
        return math_1.mat4FromMat2d(out, this.getMatrix());
    };
    Transform2D.prototype.getMatrix2d = function (out) {
        return gl_matrix_1.mat2d.copy(out, this.getMatrix());
    };
    Transform2D.prototype.getLocalMatrix4 = function (out) {
        return math_1.mat4FromMat2d(out, this.getLocalMatrix());
    };
    Transform2D.prototype.getLocalMatrix2d = function (out) {
        return gl_matrix_1.mat2d.copy(out, this.getLocalMatrix());
    };
    Transform2D.prototype.lookAt = function (position) {
        return this.setLocalRotation(math_1.getAngleBetweenPoints(this.localPosition, position));
    };
    Transform2D.Manager = Transform2DManager_1.Transform2DManager;
    return Transform2D;
}(TransformComponent_1.TransformComponent));
exports.Transform2D = Transform2D;
