"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UITextCtxRendererHandler = void 0;
const UI_1 = require("../../../../components/UI");
const TransformComponent_1 = require("../../../../components/TransformComponent");
const CtxRendererHandler_1 = require("../CtxRendererHandler");
const gl_matrix_1 = require("gl-matrix");
const getTextDimensions_1 = require("../../../getTextDimensions");
const MAT2_0 = gl_matrix_1.mat2d.create();
function getCtxFontStyle(uiText) {
    return `${uiText.getSize()}px ${uiText.getFont()}`;
}
class UITextCtxRendererHandler extends CtxRendererHandler_1.CtxRendererHandler {
    onRender() {
        this.getManager(UI_1.UIElementManager).ifSome((uiElementManager) => {
            const renderer = this.getRequiredRenderer();
            for (const uiElement of uiElementManager.getComponents()) {
                if (uiElement.getRenderable()) {
                    uiElement
                        .getEntity()
                        .flatMap(TransformComponent_1.TransformComponent.getTransform)
                        .map((transform) => renderer.render((ctx) => {
                        if (uiElement instanceof UI_1.UIText) {
                            ctx.scale(getTextDimensions_1.INV_BASE_SIZE, -getTextDimensions_1.INV_BASE_SIZE);
                            ctx.font = getCtxFontStyle(uiElement);
                            ctx.textBaseline = uiElement.getBaseline();
                            ctx.textAlign = uiElement.getAlign();
                            ctx.direction = uiElement.getDirection();
                            ctx.fillText(uiElement.getText(), 0, 0);
                        }
                    }, transform.getMatrix2d(MAT2_0)));
                }
            }
        });
        return this;
    }
}
exports.UITextCtxRendererHandler = UITextCtxRendererHandler;
