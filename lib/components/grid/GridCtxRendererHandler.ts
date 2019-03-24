import { CtxRenderer, CtxRendererHandler } from "../../plugins/renderer";
import { toRgba } from "../../utils/math";
import { Transform2D } from "../transform2d";
import { Grid } from "./Grid";
import { GridManager } from "./GridManager";

export class GridCtxRendererHandler extends CtxRendererHandler {
  static rendererHandlerName = "engine.GridCtxRendererHandler";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(GridManager));
  }

  onRender() {
    const camera = this.getCamera(),
      position = camera
        .getComponent(Transform2D)
        .unwrap()
        .getPosition(),
      scale = this.getScale(),
      hw = camera.getWidth() * 0.6 * scale,
      hh = camera.getHeight() * 0.6 * scale;

    this.getManager().map(manager =>
      manager.getComponents<Grid>().forEach(grid =>
        this.getRenderer<CtxRenderer>().map(renderer =>
          renderer.render(ctx => {
            ctx.translate(position[0] | 0, position[1] | 0);

            ctx.lineWidth = scale * grid.getLineSize();
            ctx.strokeStyle = toRgba(grid.getColor());
            ctx.beginPath();

            for (let x = -hw; x <= hw; x += grid.getSize()) {
              ctx.moveTo(x, -hh);
              ctx.lineTo(x, hh);
            }

            for (let y = -hh; y <= hh; y += grid.getSize()) {
              ctx.moveTo(-hw, y);
              ctx.lineTo(hw, y);
            }

            ctx.stroke();
          })
        )
      )
    );

    return this;
  }
}
