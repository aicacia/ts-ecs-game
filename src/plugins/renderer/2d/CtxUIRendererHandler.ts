import { UIElementManager, UIText } from "../../../components";
import { TransformComponent } from "../../../components/TransformComponent";
import { CtxRendererHandler } from "../CtxRendererHandler";
import { mat2d } from "gl-matrix";
import { INV_BASE_SIZE } from "../../../utils/getTextDimensions";

const MAT2_0 = mat2d.create();

export class CtxUIRendererHandler extends CtxRendererHandler {
  onRender() {
    this.getManager(UIElementManager).ifSome((uiElementManager) => {
      const renderer = this.getRequiredRenderer();

      uiElementManager.getComponents().forEach((uiElement) => {
        if (uiElement.getRenderable()) {
          uiElement
            .getEntity()
            .flatMap(TransformComponent.getTransform)
            .map((transform) =>
              renderer.render((ctx) => {
                if (uiElement instanceof UIText) {
                  const uiText = uiElement;
                  ctx.scale(INV_BASE_SIZE, -INV_BASE_SIZE);
                  ctx.font = uiText.getCtxFontStyle();
                  ctx.textBaseline = uiText.getBaseline();
                  ctx.textAlign = uiText.getAlign();
                  ctx.direction = uiText.getDirection();
                  ctx.fillText(uiText.getText(), 0, 0);
                }
              }, transform.getMatrix2d(MAT2_0))
            );
        }
      });
    });

    return this;
  }
}
