import { none, Option, some, IConstructor } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class EventListener<
  I extends Input = Input
> extends EventEmitter {
  private input: Option<I> = none();

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

  queueEvent(event: InputEvent) {
    return this.getInput().map((input) => input.queueEvent(event));
  }
  abstract dequeueEvent(event: InputEvent): boolean;

  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }
  onUpdate(_time: Time) {
    return this;
  }
}

import { Time } from "../Time";
import { Input } from "./Input";
import { InputEvent } from "./InputEvent";
