let CANVAS: HTMLCanvasElement = null as any;

export function getGlobalCanvas() {
  if (CANVAS === null) {
    CANVAS = document.createElement("canvas");
  }
  return CANVAS;
}
