"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformComponent = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var RenderableComponent_1 = require("./RenderableComponent");
var TransformComponentManager_1 = require("./TransformComponentManager");
var VEC2_0 = gl_matrix_1.vec2.create(), VEC3_0 = gl_matrix_1.vec3.create();
var TransformComponent = /** @class */ (function (_super) {
    tslib_1.__extends(TransformComponent, _super);
    function TransformComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.needsUpdate = true;
        _this.localNeedsUpdate = true;
        return _this;
    }
    TransformComponent.getParentTransform = function (entity) {
        return entity.getParent().flatMap(TransformComponent.getTransform);
    };
    TransformComponent.getTransform = function (entity) {
        var entityTransform = entity.getComponentInstanceOf(TransformComponent);
        if (entityTransform.isSome()) {
            return entityTransform;
        }
        else {
            return TransformComponent.getParentTransform(entity);
        }
    };
    TransformComponent.getRequiredTransform = function (entity) {
        return TransformComponent.getTransform(entity).expect("Entity required a TransformComponent");
    };
    TransformComponent.prototype.onDetach = function () {
        return this.setNeedsUpdate();
    };
    TransformComponent.prototype.getParentTransform = function () {
        return this.getEntity().flatMap(TransformComponent.getParentTransform);
    };
    TransformComponent.prototype.setNeedsUpdate = function (needsUpdate) {
        if (needsUpdate === void 0) { needsUpdate = true; }
        this.setLocalNeedsUpdate(needsUpdate);
        if (needsUpdate !== this.needsUpdate) {
            this.needsUpdate = needsUpdate;
            this.getEntity().map(function (entity) {
                return entity.forEachChild(function (child) {
                    return child
                        .getComponentsInstanceOf(TransformComponent)
                        .forEach(function (transform) {
                        return transform.setNeedsUpdate(needsUpdate);
                    });
                });
            });
        }
        return this;
    };
    TransformComponent.prototype.getNeedsUpdate = function () {
        return this.needsUpdate;
    };
    TransformComponent.prototype.setLocalNeedsUpdate = function (localNeedsUpdate) {
        if (localNeedsUpdate === void 0) { localNeedsUpdate = true; }
        this.localNeedsUpdate = localNeedsUpdate;
        return this;
    };
    TransformComponent.prototype.getLocalNeedsUpdate = function () {
        return this.localNeedsUpdate;
    };
    TransformComponent.prototype.updateLocalMatrixIfNeeded = function () {
        if (this.localNeedsUpdate) {
            this.localNeedsUpdate = false;
            return this.updateLocalMatrix();
        }
        else {
            return this;
        }
    };
    TransformComponent.prototype.updateMatrixIfNeeded = function () {
        if (this.needsUpdate) {
            this.needsUpdate = false;
            return this.updateMatrix();
        }
        else {
            return this;
        }
    };
    TransformComponent.prototype.translate2 = function (position) {
        var current = this.getLocalPosition2(VEC2_0);
        gl_matrix_1.vec2.add(current, current, position);
        return this.setLocalPosition2(current);
    };
    TransformComponent.prototype.translate3 = function (position) {
        var current = this.getLocalPosition3(VEC3_0);
        gl_matrix_1.vec3.add(current, current, position);
        return this.setLocalPosition3(current);
    };
    TransformComponent.prototype.scale2 = function (scale) {
        var current = this.getLocalScale2(VEC2_0);
        gl_matrix_1.vec2.mul(current, current, scale);
        return this.setLocalPosition2(current);
    };
    TransformComponent.prototype.scale3 = function (scale) {
        var current = this.getLocalScale3(VEC3_0);
        gl_matrix_1.vec3.mul(current, current, scale);
        return this.setLocalPosition3(current);
    };
    TransformComponent.Manager = TransformComponentManager_1.TransformComponentManager;
    return TransformComponent;
}(RenderableComponent_1.RenderableComponent));
exports.TransformComponent = TransformComponent;
