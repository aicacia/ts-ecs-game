import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class InputHandler<
  I extends Input = Input
> extends EventEmitter {
  private input: Option<I> = none();
  private events: Event[] = [];

  getConstructor(): IConstructor<this> {
    return Object.getPrototypeOf(this).constructor;
  }

  UNSAFE_setInput(input: I) {
    this.input = some(input);
    return this;
  }
  UNSAFE_removeInput() {
    this.input = none();
    return this;
  }
  getInput() {
    return this.input as Option<I>;
  }
  getRequiredInput() {
    return this.getInput().expect(
      `${this.getConstructor()} requires a Input Plugin`
    );
  }
  getScene() {
    return this.getInput().flatMap((input) => input.getScene());
  }
  getRequiredScene() {
    return this.getScene().expect(`${this.getConstructor()} requires a Scene`);
  }

  getElement() {
    return this.getInput()
      .map((input) => input.getElement())
      .expect(`${this.getConstructor()} requires an Element`);
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
    this.events.forEach((event) => this.onEvent(time, event));
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

import { IConstructor } from "../../utils";
import { Time } from "../Time";
import { Input } from "./Input";
