import { CtxRenderer, CtxRendererHandler } from "../../plugins/renderer";
import { toRgba } from "../../utils/math";
import { Arc } from "./Arc";
import { ArcManager } from "./ArcManager";
import { Transform2D } from "./Transform2D";

export class ArcCtxRendererHandler extends CtxRendererHandler {
  static rendererHandlerName = "engine.ArcCtxRendererHandler";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(ArcManager));
  }

  onRender() {
    const scale = this.getScale();

    this.getManager().map(manager =>
      manager.getComponents<Arc>().forEach(arc => {
        arc
          .getEntity()
          .flatMap(entity => entity.getComponent(Transform2D))
          .flatMap(transform2d =>
            this.getRenderer<CtxRenderer>().map(renderer =>
              renderer.render(ctx => {
                const start = arc.getStart(),
                  end = start + arc.getEnd();

                // todo: do we really need both fillStyle and strokeStyle?
                ctx.fillStyle = toRgba(arc.getColor());
                ctx.strokeStyle = toRgba(arc.getColor());
                ctx.beginPath();
                ctx.arc(0, 0, arc.getRadius(), start, end);
                ctx.stroke();
              }, transform2d.getMatrix())
            )
          );
      })
    );
    return this;
  }
}
