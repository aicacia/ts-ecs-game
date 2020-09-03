import { InputEvent } from "./InputEvent";

export class MouseInputEvent extends InputEvent<
  "mousemove" | "mousedown" | "mouseup" | "mouseleave"
> {
  button: number = 0;
  x: number = 0;
  y: number = 0;
}
