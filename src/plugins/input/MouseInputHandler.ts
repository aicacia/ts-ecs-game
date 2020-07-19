import { Time } from "../Time";
import { InputHandler } from "./InputHandler";

export class MouseInputHandler extends InputHandler {
  onAdd() {
    const element = this.getElement();

    element.addEventListener("mousemove", this.queueEvent);
    element.addEventListener("mousedown", this.queueEvent);
    element.addEventListener("mouseup", this.queueEvent);
    element.addEventListener("wheel", this.queueEvent);
    element.addEventListener("mouseleave", this.queueEvent);

    return this;
  }

  onRemove() {
    const element = this.getElement();

    element.removeEventListener("mousemove", this.queueEvent);
    element.removeEventListener("mousedown", this.queueEvent);
    element.removeEventListener("mouseup", this.queueEvent);
    element.removeEventListener("wheel", this.queueEvent);
    element.removeEventListener("mouseleave", this.queueEvent);

    return this;
  }

  onEvent(time: Time, e: MouseEvent) {
    const input = this.getRequiredInput(),
      elementRect = input.getElement().getBoundingClientRect();

    switch (e.type) {
      case "mousemove":
        const x = e.clientX - elementRect.left,
          y = e.clientY - elementRect.top;

        input.getOrCreateButton("mouseX").UNSAFE_setValue(x);
        input.getOrCreateButton("mouseY").UNSAFE_setValue(y);
        break;
      case "mousedown":
        input.getOrCreateButton("mouse" + e.which).UNSAFE_down(time.getFrame());
        break;
      case "mouseup":
      case "mouseleave":
        input.getOrCreateButton("mouse" + e.which).UNSAFE_up(time.getFrame());
        break;
      case "wheel":
        e.preventDefault();
        input
          .getOrCreateButton("mouseWheel")
          .UNSAFE_setValue((e as any).deltaY);
        break;
    }
    return this;
  }

  onAfterUpdate() {
    this.getRequiredInput().getOrCreateButton("mouseWheel").UNSAFE_setValue(0);
    return this;
  }
}
