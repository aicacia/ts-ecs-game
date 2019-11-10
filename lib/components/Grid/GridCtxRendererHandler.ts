import { toRgba } from "../../external/math";
import { CtxRenderer, CtxRendererHandler } from "../../plugins/renderer";
import { Transform2D } from "../2d/Transform2D";
import { Grid } from "./Grid";
import { GridManager } from "./GridManager";

export class GridCtxRendererHandler extends CtxRendererHandler {
  static rendererHandlerName = "engine.GridCtxRendererHandler";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(GridManager));
  }

  onRender() {
    const camera = this.getCamera(),
      cameraTransform2D = camera.getRequiredComponent(Transform2D),
      position = cameraTransform2D.getPosition(),
      scale = this.getScale(),
      width = camera.getWidth(),
      height = camera.getHeight(),
      halfWidth = width * 0.5,
      halfHeight = height * 0.5,
      renderer = this.getRequiredRenderer<CtxRenderer>();

    this.getManager().map(manager =>
      manager.getComponents<Grid>().forEach(grid =>
        renderer.render(ctx => {
          const size = grid.getSize(),
            offsetX = position[0] % 1,
            offsetY = position[1] % 1,
            startX = -halfWidth - offsetX,
            endX = halfWidth + offsetX,
            startY = -halfHeight - offsetY,
            endY = halfHeight + offsetY;

          ctx.lineWidth = scale * grid.getLineWidth();
          ctx.strokeStyle = toRgba(grid.getColor());
          ctx.beginPath();

          for (let x = startX; x <= endX; x += size) {
            ctx.moveTo(x, startY);
            ctx.lineTo(x, endX);
          }

          for (let y = startY; y <= endY; y += size) {
            ctx.moveTo(startX, y);
            ctx.lineTo(endY, y);
          }

          ctx.stroke();
        }, cameraTransform2D.getMatrix())
      )
    );

    return this;
  }
}
