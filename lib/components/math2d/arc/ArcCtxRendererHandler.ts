import { CtxRenderer, CtxRendererHandler } from "../../../plugins/renderer";
import { Transform2D } from "../../transform2d";
import { Arc } from "./Arc";
import { ArcManager } from "./ArcManager";

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
                ctx.beginPath();
                ctx.arc(
                  0,
                  0,
                  arc.getRadius() * scale,
                  arc.getStart(),
                  arc.getEnd()
                );
                ctx.stroke();
              }, transform2d.getMatrix())
            )
          );
      })
    );
    return this;
  }
}
