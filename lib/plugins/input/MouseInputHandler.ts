import { InputHandler } from "./InputHandler";

export class MouseInputHandler extends InputHandler {
  static inputHandlerName = "engine.MouseInputHandler";

  onAdd() {
    const element = this.getElement();

    element.addEventListener("mousemove", this.queueEvent);
    element.addEventListener("mousedown", this.queueEvent);
    element.addEventListener("mouseup", this.queueEvent);
    element.addEventListener("mousewheel", this.queueEvent);

    return this;
  }

  onRemove() {
    const element = this.getElement();

    element.removeEventListener("mousemove", this.queueEvent);
    element.removeEventListener("mousedown", this.queueEvent);
    element.removeEventListener("mouseup", this.queueEvent);
    element.removeEventListener("mousewheel", this.queueEvent);

    return this;
  }

  onEvent(e: MouseEvent) {
    const input = this.getInput().unwrap(),
      elementRect = input.getElement().getBoundingClientRect();

    switch (e.type) {
      case "mousemove":
        const x = e.clientX - elementRect.left,
          y = e.clientY - elementRect.top;

        input.UNSAFE_set("mouseX", x);
        input.UNSAFE_set("mouseY", y);
        break;
      case "mousedown":
        input.UNSAFE_set("mouse" + e.which, 1.0);
        break;
      case "mouseup":
        input.UNSAFE_set("mouse" + e.which, 0.0);
        break;
      case "mousewheel":
        input.UNSAFE_set("mouseWheel", (e as any).wheelDelta);
        break;
    }
    return this;
  }
}
