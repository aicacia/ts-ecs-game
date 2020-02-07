import { Time } from "../Time";
import { InputHandler } from "./InputHandler";

export class KeyboardInputHandler extends InputHandler {
  static inputHandlerName = "engine.KeyboardInputHandler";

  onAdd() {
    window.addEventListener("keydown", this.queueEvent);
    window.addEventListener("keyup", this.queueEvent);

    return this;
  }

  onRemove() {
    window.removeEventListener("keydown", this.queueEvent);
    window.removeEventListener("keyup", this.queueEvent);

    return this;
  }

  onEvent(time: Time, e: KeyboardEvent) {
    const input = this.getRequiredInput();

    switch (e.type) {
      case "keydown":
        input.getOrCreateButton(e.key).UNSAFE_down(time.getFrame());
        break;
      case "keyup":
        input.getOrCreateButton(e.key).UNSAFE_up(time.getFrame());
        break;
    }
    return this;
  }
}
