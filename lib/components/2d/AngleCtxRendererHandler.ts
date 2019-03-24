import { CtxRenderer, CtxRendererHandler } from "../../plugins/renderer";
import { toRgba } from "../../utils/math";
import { Angle } from "./Angle";
import { AngleManager } from "./AngleManager";
import { Transform2D } from "./Transform2D";

export class AngleCtxRendererHandler extends CtxRendererHandler {
  static rendererHandlerName = "engine.AngleCtxRendererHandler";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(AngleManager));
  }

  onRender() {
    const scale = this.getScale();

    this.getManager().map(manager =>
      manager.getComponents<Angle>().forEach(angle => {
        angle
          .getEntity()
          .flatMap(entity => entity.getComponent(Transform2D))
          .flatMap(transform2d =>
            this.getRenderer<CtxRenderer>().map(renderer =>
              renderer.render(ctx => {
                ctx.fillStyle = toRgba(angle.getColor());
                ctx.beginPath();
                ctx.arc(
                  0,
                  0,
                  angle.getRadius(),
                  angle.getStart(),
                  angle.getEnd()
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
