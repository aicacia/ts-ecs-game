"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformCtxRendererHandler = void 0;
var tslib_1 = require("tslib");
var TransformComponentManager_1 = require("../../../../components/TransformComponentManager");
var CtxRendererHandler_1 = require("../CtxRendererHandler");
var gl_matrix_1 = require("gl-matrix");
var MAT2D_0 = gl_matrix_1.mat2d.create();
var TransformCtxRendererHandler = /** @class */ (function (_super) {
    tslib_1.__extends(TransformCtxRendererHandler, _super);
    function TransformCtxRendererHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransformCtxRendererHandler.prototype.onRender = function () {
        var _this = this;
        this.getManager(TransformComponentManager_1.TransformComponentManager).ifSome(function (transformComponentManager) {
            var renderer = _this.getRequiredRenderer(), scale = renderer.getScale();
            transformComponentManager.getComponents().forEach(function (transform) {
                if (transform.getRenderable()) {
                    renderer.render(function (ctx) {
                        ctx.beginPath();
                        ctx.strokeStyle = "#0c0";
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0, 0.5);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.strokeStyle = "#00c";
                        ctx.moveTo(0, 0);
                        ctx.lineTo(0.5, 0);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(0, 0, scale * 2, 0, 2 * Math.PI);
                        ctx.fill();
                    }, transform.getMatrix2d(MAT2D_0));
                }
            });
        });
        return this;
    };
    return TransformCtxRendererHandler;
}(CtxRendererHandler_1.CtxRendererHandler));
exports.TransformCtxRendererHandler = TransformCtxRendererHandler;
