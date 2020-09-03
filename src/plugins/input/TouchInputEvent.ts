import { InputEvent } from "./InputEvent";

export class TouchInputEvent extends InputEvent<
  "touchstart" | "touchmove" | "touchend"
> {
  id: number = 0;
  x: number = 0;
  y: number = 0;
}
