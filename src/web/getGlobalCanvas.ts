import { none, Option } from "@aicacia/core";

const CANVAS: Option<HTMLCanvasElement> = none();

export function getGlobalCanvas() {
  if (CANVAS.isSome()) {
    return CANVAS.unwrap();
  } else {
    const canvas = document.createElement("canvas");
    CANVAS.replace(canvas);
    return canvas;
  }
}
