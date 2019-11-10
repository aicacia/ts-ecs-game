import { toRgba } from "../../../external/math";
import { CtxRenderer, CtxRendererHandler } from "../../../plugins/renderer";
import { Transform2D } from "../Transform2D";
import { Arc, Direction } from "./Arc";
import { ArcManager } from "./ArcManager";

export class ArcCtxRendererHandler extends CtxRendererHandler {
  static rendererHandlerName = "engine.ArcCtxRendererHandler";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(ArcManager));
  }

  onRender() {
    const renderer = this.getRequiredRenderer<CtxRenderer>();

    this.getManager().map(manager =>
      manager.getComponents<Arc>().forEach(arc => {
        const transform2d = arc.getRequiredComponent(Transform2D);

        renderer.render(ctx => {
          const start = arc.getStartAngle(),
            end =
              arc.getEndAngle() +
              (arc.getDirection() === Direction.CCW ? Math.PI * -1.5 : Math.PI * 0.5);

          ctx.strokeStyle = toRgba(arc.getColor());
          ctx.beginPath();
          ctx.arc(
            0,
            0,
            arc.getRadius(),
            start,
            end,
            arc.getDirection() === Direction.CW
          );
          ctx.stroke();
        }, transform2d.getMatrix());
      })
    );
    return this;
  }
}
