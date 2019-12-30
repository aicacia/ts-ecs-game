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
            willCrossCenterX = halfWidth % size === 0,
            willCrossCenterY = halfHeight % size === 0,
            offsetX = (position[0] % size) + (willCrossCenterX ? 0 : size / 2),
            offsetY = (position[1] % size) + (willCrossCenterY ? 0 : size / 2),
            left = -halfWidth - offsetX,
            right = halfWidth + offsetX,
            top = -halfHeight - offsetY,
            bottom = halfHeight + offsetY;

          ctx.lineWidth = scale * grid.getLineWidth();
          ctx.strokeStyle = toRgba(grid.getColor());
          ctx.beginPath();

          for (let x = left; x <= right; x += size) {
            ctx.moveTo(x, top);
            ctx.lineTo(x, bottom);
          }

          for (let y = top; y <= bottom; y += size) {
            ctx.moveTo(left, y);
            ctx.lineTo(right, y);
          }

          ctx.stroke();
        }, cameraTransform2D.getMatrix())
      )
    );

    return this;
  }
}
