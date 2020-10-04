"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera2DControl = void 0;
var tslib_1 = require("tslib");
var gl_matrix_1 = require("gl-matrix");
var plugins_1 = require("../../plugins");
var Camera2D_1 = require("./Camera2D");
var TransformComponent_1 = require("../TransformComponent");
var Component_1 = require("../../Component");
var Transform2D_1 = require("../Transform2D");
var Transform3D_1 = require("../Transform3D");
var Camera2DControlManager_1 = require("./Camera2DControlManager");
var VEC2_0 = gl_matrix_1.vec2.create(), VEC2_1 = gl_matrix_1.vec2.create(), VEC2_2 = gl_matrix_1.vec2.create(), ZERO = gl_matrix_1.vec2.fromValues(0, 0), MIN_SCALE = gl_matrix_1.vec2.fromValues(1, 1);
var Camera2DControl = /** @class */ (function (_super) {
    tslib_1.__extends(Camera2DControl, _super);
    function Camera2DControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.enabled = true;
        _this.panSpeed = 1.0;
        _this.zoomSpeed = 1.0;
        _this.dragging = false;
        _this.lastMouse = gl_matrix_1.vec2.create();
        _this.offset = gl_matrix_1.vec2.create();
        return _this;
    }
    Camera2DControl.prototype.getEnabled = function () {
        return this.enabled;
    };
    Camera2DControl.prototype.setEnabled = function (enabled) {
        if (enabled === void 0) { enabled = true; }
        this.enabled = enabled;
        return this;
    };
    Camera2DControl.prototype.getPanSpeed = function () {
        return this.panSpeed;
    };
    Camera2DControl.prototype.setPanSpeed = function (panSpeed) {
        this.panSpeed = panSpeed;
        return this;
    };
    Camera2DControl.prototype.getZoomSpeed = function () {
        return this.zoomSpeed;
    };
    Camera2DControl.prototype.setZoomSpeed = function (zoomSpeed) {
        this.zoomSpeed = zoomSpeed;
        return this;
    };
    Camera2DControl.prototype.onUpdate = function () {
        var input = this.getRequiredPlugin(plugins_1.Input), transform = TransformComponent_1.TransformComponent.getRequiredTransform(this.getRequiredEntity()), scale = transform.getLocalScale2(VEC2_1), camera = this.getRequiredComponent(Camera2D_1.Camera2D), worldMouse = camera.toRelative(VEC2_0, gl_matrix_1.vec2.set(VEC2_0, -input.getButtonValue("mouse-x"), -input.getButtonValue("mouse-y")));
        if (this.dragging) {
            gl_matrix_1.vec2.sub(this.offset, worldMouse, this.lastMouse);
            gl_matrix_1.vec2.scale(this.offset, this.offset, this.panSpeed);
            gl_matrix_1.vec2.mul(this.offset, this.offset, scale);
            gl_matrix_1.vec2.rotate(this.offset, this.offset, ZERO, transform.getRotationZ());
            this.enabled && transform.translate2(this.offset);
        }
        if (input.isDown("mouse-1")) {
            this.dragging = true;
        }
        else {
            this.dragging = false;
        }
        var mouseWheel = input.getButtonValue("mouse-wheel"), zoomSpeed = gl_matrix_1.vec2.set(VEC2_2, this.zoomSpeed, this.zoomSpeed);
        if (mouseWheel > 0) {
            gl_matrix_1.vec2.add(scale, scale, zoomSpeed);
        }
        else if (mouseWheel < 0) {
            gl_matrix_1.vec2.sub(scale, scale, zoomSpeed);
            gl_matrix_1.vec2.max(scale, MIN_SCALE, scale);
        }
        this.enabled && transform.setLocalScale2(scale);
        gl_matrix_1.vec2.copy(this.lastMouse, worldMouse);
        return this;
    };
    Camera2DControl.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { enabled: this.enabled, zoomSpeed: this.zoomSpeed, panSpeed: this.panSpeed });
    };
    Camera2DControl.prototype.fromJSON = function (json) {
        this.setEnabled(json.enabled);
        this.setZoomSpeed(json.zoomSpeed);
        this.setPanSpeed(json.panSpeed);
        return this;
    };
    Camera2DControl.Manager = Camera2DControlManager_1.Camera2DControlManager;
    Camera2DControl.requiredComponents = [[Transform2D_1.Transform2D, Transform3D_1.Transform3D]];
    Camera2DControl.requiredPlugins = [plugins_1.Input];
    return Camera2DControl;
}(Component_1.Component));
exports.Camera2DControl = Camera2DControl;