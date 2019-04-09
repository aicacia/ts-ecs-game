import { toRgba } from "../../external/math";
import { CtxRenderer, CtxRendererHandler } from "../../plugins/renderer";
import { Arc } from "./Arc";
import { ArcManager } from "./ArcManager";
import { Transform2D } from "./Transform2D";

export class ArcCtxRendererHandler extends CtxRendererHandler {
  static rendererHandlerName = "engine.ArcCtxRendererHandler";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(ArcManager));
  }

  onRender() {
    const renderer = this.getRenderer<CtxRenderer>().expect(
      "ArcCtxRendererHandler onRender called without having a CtxRenderer"
    );

    this.getManager().map(manager =>
      manager.getComponents<Arc>().forEach(arc => {
        const transform2d = arc
          .getComponent(Transform2D)
          .expect("ArcCtxRendererHandler Arc rqeuires a Transform2D");

        renderer.render(ctx => {
          const start = arc.getStart(),
            end = start + arc.getEnd();

          ctx.strokeStyle = toRgba(arc.getColor());
          ctx.beginPath();
          ctx.arc(0, 0, arc.getRadius(), start, end);
          ctx.stroke();
        }, transform2d.getMatrix());
      })
    );
    return this;
  }
}
