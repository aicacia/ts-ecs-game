import { CtxRenderer, CtxRendererPlugin } from "../../../plugins/renderer";
import { Line } from "./Line";
import { LineManager } from "./LineManager";

export class LineCtxRenderer extends CtxRenderer {
  static rendererName = "engine.LineCtxRenderer";

  getManager() {
    return this.getScene().flatMap(scene => scene.getManager(LineManager));
  }

  onRender() {
    this.getManager().map(manager =>
      manager.getComponents<Line>().forEach(line => {
        this.getRendererPlugin<CtxRendererPlugin>().map(rendererPlugin =>
          rendererPlugin.render(ctx => {
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
