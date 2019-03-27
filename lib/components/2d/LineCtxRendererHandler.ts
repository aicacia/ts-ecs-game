import { vec2 } from "gl-matrix";
import { CtxRenderer, CtxRendererHandler } from "../../plugins/renderer";
import { toRgba } from "../../utils/math";
import { Line, LineType } from "./Line";
import { LineManager } from "./LineManager";

const VEC2_0 = vec2.create(),
  VEC2_1 = vec2.create();

export class LineCtxRendererHandler extends CtxRendererHandler {
  static rendererHandlerName = "engine.LineCtxRendererHandler";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(LineManager));
  }

  onRender() {
    this.getManager().map(manager =>
      manager.getComponents<Line>().forEach(line => {
        this.getRenderer<CtxRenderer>().map(renderer =>
          renderer.render(ctx => {
            const start = line.getStart(VEC2_0),
              end = line.getEnd(VEC2_1);

            ctx.fillStyle = toRgba(line.getColor());
            ctx.beginPath();

            switch (line.getType()) {
              case LineType.Normal: {
                break;
              }
              case LineType.Dashed: {
                ctx.setLineDash([0.5, 0.2]);
                break;
              }
              case LineType.Dotted: {
                ctx.setLineDash([0.1, 0.1]);
                break;
              }
            }

            ctx.moveTo(start[0], start[1]);
            ctx.lineTo(end[0], end[1]);
            ctx.stroke();
          })
        );
      })
    );
    return this;
  }
}
