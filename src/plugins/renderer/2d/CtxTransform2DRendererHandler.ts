import { Transform2DManager } from "../../../components";
import { CtxRendererHandler } from "../CtxRendererHandler";

export class CtxTransform2DRendererHandler extends CtxRendererHandler {
  onRender() {
    this.getManager(Transform2DManager).ifSome((transform2dManager) => {
      const renderer = this.getRequiredRenderer(),
        scale = renderer.getScale();

      transform2dManager.getComponents().forEach((transform2d) => {
        if (transform2d.getRenderable()) {
          renderer.render((ctx) => {
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
  }
}
