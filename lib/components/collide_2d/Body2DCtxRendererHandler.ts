import { vec4 } from "gl-matrix";
import { Circle } from "../../external/collide_2d";
import { toRgba } from "../../external/math";
import { CtxRenderer, CtxRendererHandler } from "../../plugins/renderer";
import { Body2D } from "./Body2D";
import { Body2DManager } from "./Body2DManager";

const VEC2_0 = vec4.fromValues(0, 1, 0, 1);

export class Body2DCtxRendererHandler extends CtxRendererHandler {
  static rendererHandlerName = "engine.Body2DCtxRendererHandler";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(Body2DManager));
  }

  onRender() {
    const renderer = this.getRenderer<CtxRenderer>().expect(
      "Body2DCtxRendererHandler onRender called without having a CtxRenderer"
    );
    this.getManager().map(manager =>
      manager.getComponents<Body2D>().forEach(body2d => {
        body2d
          .getBody()
          .getShapes()
          .forEach(shape => {
            renderer.render(ctx => {
              ctx.beginPath();
              ctx.fillStyle = toRgba(VEC2_0);

              if (shape instanceof Circle) {
                ctx.beginPath();
                ctx.arc(0, 0, shape.getRadius(), 0, Math.PI * 2.0);
                ctx.stroke();
              }

              ctx.stroke();
            }, shape.getMatrix());
          });
      })
    );
    return this;
  }
}
