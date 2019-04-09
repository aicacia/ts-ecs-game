import { toRgba } from "../../external/math";
import { CtxRenderer, CtxRendererHandler } from "../../plugins/renderer";
import { Point, PointType } from "./Point";
import { PointManager } from "./PointManager";
import { Transform2D } from "./Transform2D";

export class PointCtxRendererHandler extends CtxRendererHandler {
  static rendererHandlerName = "engine.PointCtxRendererHandler";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(PointManager));
  }

  onRender() {
    const scale = this.getScale(),
      renderer = this.getRenderer<CtxRenderer>().expect(
        "PointCtxRendererHandler onRender called without having a CtxRenderer"
      );

    this.getManager().map(manager =>
      manager.getComponents<Point>().forEach(point => {
        const transform2d = point
          .getComponent(Transform2D)
          .expect("PointCtxRendererHandler Point rqeuires a Transform2D");

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
              ctx.arc(0, 0, point.getSize() * 1.5 * scale, 0, 2 * Math.PI);
              break;
            }
            case PointType.Triangle: {
              const size = point.getSize() * 2 * scale;

              ctx.moveTo(size, 0);
              ctx.lineTo(-size, size);
              ctx.lineTo(-size, -size);
              ctx.closePath();
              break;
            }
          }

          if (point.getFill()) {
            ctx.fill();
          } else {
            ctx.stroke();
          }
        }, transform2d.getMatrix());
      })
    );
    return this;
  }
}
