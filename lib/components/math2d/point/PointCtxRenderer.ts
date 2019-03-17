import { CtxRenderer, CtxRendererPlugin } from "../../../plugins/renderer";
import { Transform2D } from "../../transform2d";
import { Point } from "./Point";
import { PointManager } from "./PointManager";

export class PointCtxRenderer extends CtxRenderer {
  static rendererName = "engine.PointCtxRenderer";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(PointManager));
  }

  onRender() {
    const invScale = this.getInvScale();

    this.getManager().map(manager =>
      manager.getComponents<Point>().forEach(point => {
        point
          .getEntity()
          .flatMap(entity => entity.getComponent(Transform2D))
          .flatMap(transform2d =>
            this.getRendererPlugin<CtxRendererPlugin>().map(rendererPlugin =>
              rendererPlugin.render(ctx => {
                ctx.beginPath();
                ctx.arc(0, 0, point.getSize() * 2 * invScale, 0, 2 * Math.PI);
                ctx.fill();
              }, transform2d.getMatrix())
            )
          );
      })
    );
    return this;
  }
}
