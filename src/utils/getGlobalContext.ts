let CANVAS: HTMLCanvasElement = null as any,
  CONTEXT: CanvasRenderingContext2D = null as any;

export function getGlobalContext() {
  if (CANVAS === null) {
    CANVAS = document.createElement("canvas");
    CONTEXT = CANVAS.getContext("2d") as CanvasRenderingContext2D;
  }
  return CONTEXT;
}
