"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UITextCtxRendererHandler = void 0;
var tslib_1 = require("tslib");
var UI_1 = require("../../../../components/UI");
var TransformComponent_1 = require("../../../../components/TransformComponent");
var CtxRendererHandler_1 = require("../CtxRendererHandler");
var gl_matrix_1 = require("gl-matrix");
var getTextDimensions_1 = require("../../../getTextDimensions");
var MAT2_0 = gl_matrix_1.mat2d.create();
function getCtxFontStyle(uiText) {
    return uiText.getSize() + "px " + uiText.getFont();
}
var UITextCtxRendererHandler = /** @class */ (function (_super) {
    tslib_1.__extends(UITextCtxRendererHandler, _super);
    function UITextCtxRendererHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UITextCtxRendererHandler.prototype.onRender = function () {
        var _this = this;
        this.getManager(UI_1.UIElementManager).ifSome(function (uiElementManager) {
            var renderer = _this.getRequiredRenderer();
            uiElementManager.getComponents().forEach(function (uiElement) {
                if (uiElement.getRenderable()) {
                    uiElement
                        .getEntity()
                        .flatMap(TransformComponent_1.TransformComponent.getTransform)
                        .map(function (transform) {
                        return renderer.render(function (ctx) {
                            if (uiElement instanceof UI_1.UIText) {
                                ctx.scale(getTextDimensions_1.INV_BASE_SIZE, -getTextDimensions_1.INV_BASE_SIZE);
                                ctx.font = getCtxFontStyle(uiElement);
                                ctx.textBaseline = uiElement.getBaseline();
                                ctx.textAlign = uiElement.getAlign();
                                ctx.direction = uiElement.getDirection();
                                ctx.fillText(uiElement.getText(), 0, 0);
                            }
                        }, transform.getMatrix2d(MAT2_0));
                    });
                }
            });
        });
        return this;
    };
    return UITextCtxRendererHandler;
}(CtxRendererHandler_1.CtxRendererHandler));
exports.UITextCtxRendererHandler = UITextCtxRendererHandler;
