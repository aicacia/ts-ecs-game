import { CtxRenderer, CtxRendererHandler } from "../../../plugins/renderer";
import { Transform2D } from "../../transform2d";
import { Point } from "./Point";
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
                ctx.arc(0, 0, point.getSize() * scale, 0, 2 * Math.PI);
                ctx.fill();
              }, transform2d.getMatrix())
            )
          );
      })
    );
    return this;
  }
}
