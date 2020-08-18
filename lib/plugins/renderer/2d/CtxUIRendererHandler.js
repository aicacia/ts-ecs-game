"use strict";
exports.__esModule = true;
exports.CtxUIRendererHandler = void 0;
var tslib_1 = require("tslib");
var components_1 = require("../../../components");
var TransformComponent_1 = require("../../../components/TransformComponent");
var CtxRendererHandler_1 = require("../CtxRendererHandler");
var gl_matrix_1 = require("gl-matrix");
var getTextDimensions_1 = require("../../../utils/getTextDimensions");
var MAT2_0 = gl_matrix_1.mat2d.create();
var CtxUIRendererHandler = /** @class */ (function (_super) {
    tslib_1.__extends(CtxUIRendererHandler, _super);
    function CtxUIRendererHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CtxUIRendererHandler.prototype.onRender = function () {
        var _this = this;
        this.getManager(components_1.UIElementManager).ifSome(function (uiElementManager) {
            var renderer = _this.getRequiredRenderer();
            uiElementManager.getComponents().forEach(function (uiElement) {
                if (uiElement.getRenderable()) {
                    uiElement
                        .getEntity()
                        .flatMap(TransformComponent_1.TransformComponent.getTransform)
                        .map(function (transform) {
                        return renderer.render(function (ctx) {
                            if (uiElement instanceof components_1.UIText) {
                                var uiText = uiElement;
                                ctx.scale(getTextDimensions_1.INV_BASE_SIZE, -getTextDimensions_1.INV_BASE_SIZE);
                                ctx.font = uiText.getCtxFontStyle();
                                ctx.textBaseline = uiText.getBaseline();
                                ctx.textAlign = uiText.getAlign();
                                ctx.direction = uiText.getDirection();
                                ctx.fillText(uiText.getText(), 0, 0);
                            }
                        }, transform.getMatrix2d(MAT2_0));
                    });
                }
            });
        });
        return this;
    };
    return CtxUIRendererHandler;
}(CtxRendererHandler_1.CtxRendererHandler));
exports.CtxUIRendererHandler = CtxUIRendererHandler;