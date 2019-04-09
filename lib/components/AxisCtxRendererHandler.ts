import { toRgba } from "../external/math";
import { CtxRenderer, CtxRendererHandler } from "../plugins/renderer";
import { Transform2D } from "./2d/Transform2D";
import { Axis } from "./Axis";
import { AxisManager } from "./AxisManager";

export class AxisCtxRendererHandler extends CtxRendererHandler {
  static rendererHandlerName = "engine.AxisCtxRendererHandler";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(AxisManager));
  }

  onRender() {
    const camera = this.getCamera(),
      cameraTransform2D = camera.getComponent(Transform2D).unwrap(),
      position = cameraTransform2D.getPosition(),
      width = camera.getWidth(),
      height = camera.getHeight(),
      halfWidth = width * 0.5,
      halfHeight = height * 0.5,
      renderer = this.getRenderer<CtxRenderer>().expect(
        "AxisCtxRendererHandler onRender called without having a CtxRenderer"
      );

    this.getManager().map(manager =>
      manager.getComponents<Axis>().forEach(grid =>
        renderer.render(ctx => {
          const offsetX = position[0] % 1,
            offsetY = position[1] % 1,
            startX = -halfWidth - offsetX,
            endX = halfWidth + offsetX,
            startY = -halfHeight - offsetY,
            endY = halfHeight + offsetY;

          ctx.strokeStyle = toRgba(grid.getXColor());
          ctx.beginPath();
          ctx.moveTo(startX, 0);
          ctx.lineTo(endX, 0);
          ctx.stroke();

          ctx.strokeStyle = toRgba(grid.getYColor());
          ctx.beginPath();
          ctx.moveTo(0, startY);
          ctx.lineTo(0, endY);
          ctx.stroke();
        })
      )
    );

    return this;
  }
}
