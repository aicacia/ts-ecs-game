import { UIElementManager, UIText } from "../../../../components/UI";
import { TransformComponent } from "../../../../components/TransformComponent";
import { CtxRendererHandler } from "../CtxRendererHandler";
import { mat2d } from "gl-matrix";
import { INV_BASE_SIZE } from "../../../getTextDimensions";

const MAT2_0 = mat2d.create();

function getCtxFontStyle(uiText: UIText) {
  return `${uiText.getSize()}px ${uiText.getFont()}`;
}

export class UITextCtxRendererHandler extends CtxRendererHandler {
  onRender() {
    this.getManager(UIElementManager).ifSome((uiElementManager) => {
      const renderer = this.getRequiredRenderer();

      for (const uiElement of uiElementManager.getComponents()) {
        if (uiElement.getRenderable()) {
          uiElement
            .getEntity()
            .flatMap(TransformComponent.getTransform)
            .ifSome((transform) =>
              renderer.render((ctx) => {
                if (uiElement instanceof UIText) {
                  ctx.scale(INV_BASE_SIZE, -INV_BASE_SIZE);
                  ctx.font = getCtxFontStyle(uiElement);
                  ctx.textBaseline = uiElement.getBaseline();
                  ctx.textAlign = uiElement.getAlign();
                  ctx.direction = uiElement.getDirection();
                  ctx.fillText(uiElement.getText(), 0, 0);
                }
              }, transform.getMatrix2d(MAT2_0))
            );
        }
      }
    });

    return this;
  }
}
