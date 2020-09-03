import { EventListener } from "./EventListener";
import { Pool } from "../../utils/Pool";
import { TouchInputEvent } from "./TouchInputEvent";
import { MouseWheelInputEvent } from "./MouseWheelInputEvent";
import { KeyboardInputEvent } from "./KeyboardInputEvent";
import { MouseInputEvent } from "./MouseInputEvent";

export class WebEventListener extends EventListener {
  private touchInputEventPool = new Pool(TouchInputEvent);
  private mouseInputEventPool = new Pool(MouseInputEvent);
  private mouseWheelInputEventPool = new Pool(MouseWheelInputEvent);
  private keyboardInputEventPool = new Pool(KeyboardInputEvent);

  private element: Element;

  constructor(element: Element) {
    super();

    this.element = element;
  }

  onAdd() {
    this.element.addEventListener("touchstart", this.onTouch);
    this.element.addEventListener("touchmove", this.onTouch);
    this.element.addEventListener("touchend", this.onTouch);
    this.element.addEventListener("touchcancel", this.onTouch);

    this.element.addEventListener("mousemove", this.onMouse);
    this.element.addEventListener("mousedown", this.onMouse);
    this.element.addEventListener("mouseup", this.onMouse);
    this.element.addEventListener("wheel", this.onMouseWheel);
    this.element.addEventListener("mouseleave", this.onMouse);

    this.element.addEventListener("keydown", this.onKeyboard);
    this.element.addEventListener("keyup", this.onKeyboard);

    return this;
  }

  onRemove() {
    this.element.removeEventListener("touchstart", this.onTouch);
    this.element.removeEventListener("touchmove", this.onTouch);
    this.element.removeEventListener("touchend", this.onTouch);
    this.element.removeEventListener("touchcancel", this.onTouch);

    this.element.removeEventListener("mousemove", this.onMouse);
    this.element.removeEventListener("mousedown", this.onMouse);
    this.element.removeEventListener("mouseup", this.onMouse);
    this.element.removeEventListener("wheel", this.onMouseWheel);
    this.element.removeEventListener("mouseleave", this.onMouse);

    this.element.removeEventListener("keydown", this.onKeyboard);
    this.element.removeEventListener("keyup", this.onKeyboard);

    return this;
  }

  onTouch = (e: Event) => {
    const touchEvent = e as TouchEvent,
      elementRect = this.element.getBoundingClientRect();

    for (let i = 0, il = touchEvent.touches.length; i < il; i++) {
      const touch = touchEvent.touches[i],
        x = touch.clientX - elementRect.left,
        y = touch.clientY - elementRect.top,
        event = this.touchInputEventPool.create(touchEvent.type as any);

      event.id = touch.identifier;
      event.x = x;
      event.y = y;

      this.queueEvent(event);
    }
  };

  onMouse = (e: Event) => {
    const mouseEvent = e as MouseEvent,
      elementRect = this.element.getBoundingClientRect(),
      x = mouseEvent.clientX - elementRect.left,
      y = mouseEvent.clientY - elementRect.top,
      event = this.mouseInputEventPool.create(mouseEvent.type as any);

    event.button = mouseEvent.which;
    event.x = mouseEvent.x;
    event.y = mouseEvent.y;

    this.queueEvent(event);
  };

  onMouseWheel = (e: Event) => {
    const mouseWheelEvent = e as MouseWheelEvent,
      event = this.mouseWheelInputEventPool.create(mouseWheelEvent.type as any);

    event.wheel = mouseWheelEvent.deltaY;

    this.queueEvent(event);
  };

  onKeyboard = (e: Event) => {
    const keyEvent = e as KeyboardEvent,
      event = this.keyboardInputEventPool.create(keyEvent.type as any);

    event.code = keyEvent.code;

    this.queueEvent(event);
  };

  dequeueEvent(event: InputEvent) {
    if (event instanceof MouseInputEvent) {
      this.mouseInputEventPool.release(event);
      return true;
    } else if (event instanceof KeyboardInputEvent) {
      this.keyboardInputEventPool.release(event);
      return true;
    } else if (event instanceof MouseWheelInputEvent) {
      this.mouseWheelInputEventPool.release(event);
      return true;
    } else if (event instanceof TouchInputEvent) {
      this.touchInputEventPool.release(event);
      return true;
    } else {
      return false;
    }
  }
}
