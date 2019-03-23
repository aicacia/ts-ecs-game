import { CtxRenderer, CtxRendererHandler } from "../../../plugins/renderer";
import { toRgba } from "../../../utils/math";
import { Transform2D } from "../../transform2d";
import { Point, PointType } from "./Point";
import { PointManager } from "./PointManager";

export class PointCtxRendererHandler extends CtxRendererHandler {
  static rendererHandlerName = "engine.PointCtxRendererHandler";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(PointManager));
  }

  onRender() {
    const scale = this.getScale();

    this.getManager().map(manager =>
      manager.getComponents<Point>().forEach(point => {
        point
          .getEntity()
          .flatMap(entity => entity.getComponent(Transform2D))
          .flatMap(transform2d =>
            this.getRenderer<CtxRenderer>().map(renderer =>
              renderer.render(ctx => {
                ctx.beginPath();
                ctx.fillStyle = toRgba(point.getColor());

                switch (point.getType()) {
                  case PointType.Square: {
                    const size = point.getSize() * 2 * scale;

                    ctx.moveTo(size, size);
                    ctx.lineTo(-size, size);
                    ctx.lineTo(-size, -size);
                    ctx.lineTo(size, -size);
                    break;
                  }
                  case PointType.Circle: {
                    ctx.arc(0, 0, point.getSize() * scale, 0, 2 * Math.PI);
                    break;
                  }
                  case PointType.Triangle: {
                    const size = point.getSize() * 2 * scale;

                    ctx.moveTo(0, size);
                    ctx.lineTo(-size, -size);
                    ctx.lineTo(size, -size);
                    ctx.closePath();
                    break;
                  }
                }

                if (point.getFill()) {
                  ctx.fill();
                } else {
                  ctx.stroke();
                }
              }, transform2d.getMatrix())
            )
          );
      })
    );
    return this;
  }
}
