import { none, Option } from "@aicacia/core";
import { getGlobalCanvas } from "./getGlobalCanvas";

const CONTEXT: Option<CanvasRenderingContext2D> = none();

export function getGlobalContext() {
  if (CONTEXT.isSome()) {
    return CONTEXT.unwrap();
  } else {
    const context = getGlobalCanvas().getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    CONTEXT.replace(context);
    return context;
  }
}
