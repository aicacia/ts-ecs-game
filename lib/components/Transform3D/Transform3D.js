"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform3D = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var TransformComponent_1 = require("../TransformComponent");
var math_1 = require("../../math");
var MAT4_0 = gl_matrix_1.mat4.create(), QUAT_0 = gl_matrix_1.quat.create(), VEC3_0 = gl_matrix_1.vec3.create(), VEC3_UP = gl_matrix_1.vec3.fromValues(0.0, 0.0, 1.0);
var Transform3D = /** @class */ (function (_super) {
    tslib_1.__extends(Transform3D, _super);
    function Transform3D() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.localPosition = gl_matrix_1.vec3.create();
        _this.localScale = gl_matrix_1.vec3.fromValues(1, 1, 1);
        _this.localRotation = gl_matrix_1.quat.identity(gl_matrix_1.quat.create());
        _this.localMatrix = gl_matrix_1.mat4.create();
        _this.position = gl_matrix_1.vec3.create();
        _this.scale = gl_matrix_1.vec3.fromValues(1, 1, 1);
        _this.rotation = gl_matrix_1.quat.identity(gl_matrix_1.quat.create());
        _this.matrix = gl_matrix_1.mat4.create();
        return _this;
    }
    Transform3D.prototype.getLocalPosition3 = function (out) {
        return gl_matrix_1.vec3.copy(out, this.getLocalPosition());
    };
    Transform3D.prototype.getLocalPosition2 = function (out) {
        var localPosition = this.getLocalPosition();
        out[0] = localPosition[0];
        out[1] = localPosition[1];
        return out;
    };
    Transform3D.prototype.setLocalPosition2 = function (localPosition) {
        return this.setLocalPosition(gl_matrix_1.vec3.set(VEC3_0, localPosition[0], localPosition[1], this.localPosition[2]));
    };
    Transform3D.prototype.setLocalPosition3 = function (localPosition) {
        return this.setLocalPosition(localPosition);
    };
    Transform3D.prototype.getPosition3 = function (out) {
        return gl_matrix_1.vec3.copy(out, this.getPosition());
    };
    Transform3D.prototype.getPosition2 = function (out) {
        var position = this.getPosition();
        out[0] = position[0];
        out[1] = position[1];
        return out;
    };
    Transform3D.prototype.getLocalRotationQuat = function (out) {
        return gl_matrix_1.quat.copy(out, this.localRotation);
    };
    Transform3D.prototype.getLocalRotationZ = function () {
        return gl_matrix_1.quat.getAxisAngle(VEC3_UP, this.localRotation);
    };
    Transform3D.prototype.setLocalRotationZ = function (localRotation) {
        var localRotationQuat = gl_matrix_1.quat.copy(QUAT_0, this.getLocalRotation());
        gl_matrix_1.quat.rotateZ(localRotationQuat, localRotationQuat, localRotation);
        return this.setLocalRotation(localRotationQuat);
    };
    Transform3D.prototype.setLocalRotationQuat = function (localRotation) {
        return this.setLocalRotation(localRotation);
    };
    Transform3D.prototype.getRotationQuat = function (out) {
        return gl_matrix_1.quat.copy(out, this.getRotation());
    };
    Transform3D.prototype.getRotationZ = function () {
        return gl_matrix_1.quat.getAxisAngle(VEC3_UP, this.getRotation());
    };
    Transform3D.prototype.getLocalScale3 = function (out) {
        return gl_matrix_1.vec3.copy(out, this.getLocalScale());
    };
    Transform3D.prototype.getLocalScale2 = function (out) {
        var localScale = this.getLocalScale();
        out[0] = localScale[0];
        out[1] = localScale[1];
        return out;
    };
    Transform3D.prototype.setLocalScale2 = function (localScale) {
        return this.setLocalScale(gl_matrix_1.vec3.set(VEC3_0, localScale[0], localScale[1], this.localScale[2]));
    };
    Transform3D.prototype.setLocalScale3 = function (localScale) {
        return this.setLocalScale(localScale);
    };
    Transform3D.prototype.getScale3 = function (out) {
        return gl_matrix_1.vec3.copy(out, this.getScale());
    };
    Transform3D.prototype.getScale2 = function (out) {
        var scale = this.getScale();
        out[0] = scale[0];
        out[1] = scale[1];
        return out;
    };
    Transform3D.prototype.setLocalPosition = function (localPosition) {
        gl_matrix_1.vec3.copy(this.localPosition, localPosition);
        return this.setNeedsUpdate();
    };
    Transform3D.prototype.getPosition = function () {
        return this.updateMatrixIfNeeded().position;
    };
    Transform3D.prototype.getLocalPosition = function () {
        return this.localPosition;
    };
    Transform3D.prototype.setLocalScale = function (localScale) {
        gl_matrix_1.vec3.copy(this.localScale, localScale);
        return this.setNeedsUpdate();
    };
    Transform3D.prototype.getScale = function () {
        return this.updateMatrixIfNeeded().scale;
    };
    Transform3D.prototype.getLocalScale = function () {
        return this.localScale;
    };
    Transform3D.prototype.setLocalRotation = function (localRotation) {
        gl_matrix_1.quat.copy(this.localRotation, localRotation);
        return this.setNeedsUpdate();
    };
    Transform3D.prototype.getRotation = function () {
        return this.updateMatrixIfNeeded().rotation;
    };
    Transform3D.prototype.getLocalRotation = function () {
        return this.localRotation;
    };
    Transform3D.prototype.getMatrix = function () {
        return this.updateMatrixIfNeeded().matrix;
    };
    Transform3D.prototype.getLocalMatrix = function () {
        return this.updateLocalMatrixIfNeeded().localMatrix;
    };
    Transform3D.prototype.updateLocalMatrix = function () {
        gl_matrix_1.mat4.fromRotationTranslationScale(this.localMatrix, this.localRotation, this.localPosition, this.localScale);
        return this;
    };
    Transform3D.prototype.updateMatrix = function () {
        var _this = this;
        this.updateLocalMatrixIfNeeded()
            .getParentTransform()
            .mapOrElse(function (parentTransform) {
            gl_matrix_1.mat4.mul(_this.matrix, parentTransform.getMatrix4(MAT4_0), _this.localMatrix);
            gl_matrix_1.mat4.getRotation(_this.rotation, _this.matrix);
            gl_matrix_1.mat4.getScaling(_this.scale, _this.matrix);
            gl_matrix_1.mat4.getTranslation(_this.position, _this.matrix);
        }, function () {
            gl_matrix_1.mat4.copy(_this.matrix, _this.localMatrix);
            gl_matrix_1.vec3.copy(_this.position, _this.localPosition);
            gl_matrix_1.vec3.copy(_this.scale, _this.localScale);
            gl_matrix_1.quat.copy(_this.rotation, _this.localRotation);
        });
        return this;
    };
    Transform3D.prototype.getMatrix4 = function (out) {
        return gl_matrix_1.mat4.copy(out, this.getMatrix());
    };
    Transform3D.prototype.getMatrix2d = function (out) {
        return math_1.mat2dFromMat4(out, this.getMatrix());
    };
    Transform3D.prototype.getLocalMatrix4 = function (out) {
        return gl_matrix_1.mat4.copy(out, this.getLocalMatrix());
    };
    Transform3D.prototype.getLocalMatrix2d = function (out) {
        return math_1.mat2dFromMat4(out, this.getLocalMatrix());
    };
    Transform3D.prototype.lookAt = function (position) {
        var inverseMatrix = gl_matrix_1.mat4.invert(MAT4_0, this.getMatrix());
        if (inverseMatrix == null) {
            inverseMatrix = gl_matrix_1.mat4.identity(MAT4_0);
        }
        var localPosition = gl_matrix_1.vec3.transformMat4(VEC3_0, position, inverseMatrix);
        gl_matrix_1.mat4.getRotation(this.localRotation, gl_matrix_1.mat4.lookAt(MAT4_0, this.localPosition, localPosition, VEC3_UP));
        return this.setNeedsUpdate();
    };
    Transform3D.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { localPosition: this.localPosition, localScale: this.localScale, localRotation: this.localRotation });
    };
    Transform3D.prototype.fromJSON = function (json) {
        return _super.prototype.fromJSON.call(this, json)
            .setLocalPosition(json.localPosition)
            .setLocalScale(json.localScale)
            .setLocalRotation(json.localRotation);
    };
    return Transform3D;
}(TransformComponent_1.TransformComponent));
exports.Transform3D = Transform3D;
