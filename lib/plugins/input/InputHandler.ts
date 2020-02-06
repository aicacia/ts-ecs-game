import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class InputHandler extends EventEmitter {
  static inputHandlerName: string;

  static getInputHandlerName() {
    if (!this.inputHandlerName) {
      throw new Error(
        "Invalid inputHandlerName for InputHandler `" +
          this.inputHandlerName +
          "` " +
          this
      );
    }
    return this.inputHandlerName;
  }

  private input: Option<Input> = none();
  private events: Event[] = [];

  getInputHandlerName(): string {
    return Object.getPrototypeOf(this).constructor.getInputHandlerName();
  }

  UNSAFE_setInput(input: Input) {
    this.input = some(input);
    return this;
  }
  UNSAFE_removeInput() {
    this.input = none();
    return this;
  }
  getInput<I extends Input = Input>() {
    return this.input as Option<I>;
  }
  getScene() {
    return this.getInput().flatMap(input => input.getScene());
  }

  getElement() {
    return this.getInput()
      .map(input => input.getElement())
      .unwrap();
  }

  getEvents() {
    return this.events;
  }
  queueEvent = (event: Event) => {
    this.events.push(event);
    return this;
  };

  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }
  onUpdate(time: Time) {
    this.events.forEach(event => this.onEvent(time, event));
    this.events.length = 0;
    return this;
  }
  onAfterUpdate(time: Time) {
    return this;
  }
  onEvent(time: Time, event: Event) {
    return this;
  }
}

import { Time } from "../Time";
import { Input } from "./Input";
