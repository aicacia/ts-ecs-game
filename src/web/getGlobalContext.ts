import { getGlobalCanvas } from "./getGlobalCanvas";

let CONTEXT: CanvasRenderingContext2D = null as any;

export function getGlobalContext() {
  if (CONTEXT === null) {
    CONTEXT = getGlobalCanvas().getContext("2d") as CanvasRenderingContext2D;
  }
  return CONTEXT;
}
