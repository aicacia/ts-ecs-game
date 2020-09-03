"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CtxRenderer = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var gl_matrix_1 = require("gl-matrix");
var components_1 = require("../../components");
var math_1 = require("../../math");
var Renderer_1 = require("./Renderer");
var MAT2D_0 = gl_matrix_1.mat2d.create();
var CtxRenderer = /** @class */ (function (_super) {
    tslib_1.__extends(CtxRenderer, _super);
    function CtxRenderer(canvas, ctx) {
        var _this = _super.call(this) || this;
        _this.lineWidth = 1.0;
        _this.camera = core_1.none();
        _this.cameraView = gl_matrix_1.mat2d.create();
        _this.cameraProjection = gl_matrix_1.mat2d.create();
        _this.cameraViewProjection = gl_matrix_1.mat2d.create();
        _this.scale = 1.0;
        _this.enabled = true;
        _this.getActiveCamera = function () {
            return _this.getRequiredScene()
                .getRequiredManager(components_1.Camera2DManager)
                .getRequiredActive();
        };
        _this.canvas = canvas;
        _this.ctx = ctx;
        return _this;
    }
    CtxRenderer.prototype.getCameraView = function () {
        return this.cameraView;
    };
    CtxRenderer.prototype.getCameraProjection = function () {
        return this.cameraProjection;
    };
    CtxRenderer.prototype.getCameraViewProjection = function () {
        return this.cameraViewProjection;
    };
    CtxRenderer.prototype.getCanvas = function () {
        return this.canvas;
    };
    CtxRenderer.prototype.getCtx = function () {
        return this.ctx;
    };
    CtxRenderer.prototype.getEnabled = function () {
        return this.enabled;
    };
    CtxRenderer.prototype.setEnabled = function (enabled) {
        if (enabled === void 0) { enabled = true; }
        this.enabled = enabled;
        return this;
    };
    CtxRenderer.prototype.getLineWidth = function () {
        return this.lineWidth;
    };
    CtxRenderer.prototype.setLineWidth = function (lineWidth) {
        this.lineWidth = lineWidth;
        return this;
    };
    CtxRenderer.prototype.getCamera = function () {
        return this.camera.unwrapOrElse(this.getActiveCamera);
    };
    CtxRenderer.prototype.setCamera = function (camera) {
        this.camera = core_1.some(camera);
        return this;
    };
    CtxRenderer.prototype.removeCamera = function () {
        this.camera = core_1.none();
        return this;
    };
    CtxRenderer.prototype.getCanvasSize = function () {
        var width = this.canvas.getWidth(), height = this.canvas.getHeight();
        return (width > height ? height : width) * 0.5;
    };
    CtxRenderer.prototype.getScale = function () {
        return this.scale;
    };
    CtxRenderer.prototype.render = function (fn, model) {
        var mvp = MAT2D_0;
        if (model) {
            gl_matrix_1.mat2d.mul(mvp, this.cameraViewProjection, model);
        }
        else {
            gl_matrix_1.mat2d.copy(mvp, this.cameraViewProjection);
        }
        this.ctx.save();
        this.ctx.transform(mvp[0], mvp[1], mvp[2], mvp[3], mvp[4], mvp[5]);
        fn(this.ctx);
        this.ctx.restore();
        return this;
    };
    CtxRenderer.prototype.onUpdate = function () {
        if (!this.enabled) {
            return this;
        }
        var camera = this.getCamera(), width = this.canvas.getWidth(), height = this.canvas.getHeight(), halfWidth = width * 0.5, halfHeight = height * 0.5;
        camera.set(width, height);
        gl_matrix_1.mat2d.copy(this.cameraView, camera.getView());
        gl_matrix_1.mat2d.copy(this.cameraProjection, camera.getProjection());
        gl_matrix_1.mat2d.mul(this.cameraViewProjection, this.cameraProjection, this.cameraView);
        this.scale = (1.0 / this.getCanvasSize()) * camera.getScale();
        this.ctx.save();
        this.ctx.save();
        this.ctx.fillStyle = math_1.toRgb(camera.getBackground());
        this.ctx.fillRect(0, 0, width, height);
        this.ctx.restore();
        this.ctx.lineWidth = this.getLineWidth() * this.getScale();
        this.ctx.transform(halfWidth, 0, 0, -halfHeight, halfWidth, halfHeight);
        _super.prototype.onUpdate.call(this);
        this.ctx.restore();
        return this;
    };
    return CtxRenderer;
}(Renderer_1.Renderer));
exports.CtxRenderer = CtxRenderer;
