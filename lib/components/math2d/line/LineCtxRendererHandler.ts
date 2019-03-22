import { CtxRenderer, CtxRendererHandler } from "../../../plugins/renderer";
import { Line } from "./Line";
import { LineManager } from "./LineManager";

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
            const start = line.getStartPosition(),
              end = line.getEndPosition();

            ctx.beginPath();
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
