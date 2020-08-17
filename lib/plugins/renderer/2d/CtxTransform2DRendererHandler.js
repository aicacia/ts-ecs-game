"use strict";
exports.__esModule = true;
exports.CtxTransform2DRendererHandler = void 0;
var tslib_1 = require("tslib");
var components_1 = require("../../../components");
var CtxRendererHandler_1 = require("../CtxRendererHandler");
var CtxTransform2DRendererHandler = /** @class */ (function (_super) {
    tslib_1.__extends(CtxTransform2DRendererHandler, _super);
    function CtxTransform2DRendererHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtxTransform2DRendererHandler.prototype.onRender = function () {
        var _this = this;
        this.getManager(components_1.Transform2DManager).ifSome(function (transform2dManager) {
            var renderer = _this.getRequiredRenderer(), scale = renderer.getScale();
            transform2dManager.getComponents().forEach(function (transform2d) {
                if (transform2d.getRenderable()) {
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
                    }, transform2d.getMatrix());
                }
            });
        });
        return this;
    };
    return CtxTransform2DRendererHandler;
}(CtxRendererHandler_1.CtxRendererHandler));
exports.CtxTransform2DRendererHandler = CtxTransform2DRendererHandler;
