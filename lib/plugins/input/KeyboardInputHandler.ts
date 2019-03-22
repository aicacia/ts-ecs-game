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

  onEvent(e: KeyboardEvent) {
    const input = this.getInput().unwrap();

    switch (e.type) {
      case "keydown":
        input.UNSAFE_set(e.key, 1.0);
        break;
      case "keyup":
        input.UNSAFE_set(e.key, 0.0);
        break;
    }
    return this;
  }
}
