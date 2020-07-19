import { UIElementManager, UIText } from "../../../components";
import { TransformComponent } from "../../../components/TransformComponent";
import { CtxRendererHandler } from "../CtxRendererHandler";
import { mat2d } from "gl-matrix";

const MAT2_0 = mat2d.create(),
  ONE_SIXTEENTH = 1 / 16;

export class CtxUIRendererHandler extends CtxRendererHandler {
  onRender() {
    this.getManager(UIElementManager).ifSome((uiElementManager) => {
      const renderer = this.getRequiredRenderer(),
        scale = renderer.getScale();

      uiElementManager.getComponents().forEach((uiElement) => {
        if (uiElement.getRenderable()) {
          uiElement
            .getEntity()
            .flatMap(TransformComponent.getTransform)
            .map((transform) =>
              renderer.render((ctx) => {
                if (uiElement instanceof UIText) {
                  const uiText = uiElement;
                  ctx.scale(ONE_SIXTEENTH, -ONE_SIXTEENTH);
                  ctx.font = uiText.getCtxFontStyle(scale);
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
