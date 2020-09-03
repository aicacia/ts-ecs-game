import { none, Option, some, IConstructor } from "@aicacia/core";
import { EventEmitter } from "events";

export abstract class InputHandler<
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

  onAdd() {
    return this;
  }
  onRemove() {
    return this;
  }
  onUpdate(_time: Time) {
    return this;
  }
  onAfterUpdate(_time: Time) {
    return this;
  }
  abstract onEvent(time: Time, event: InputEvent): this;
}

import { Time } from "../Time";
import { Input, InputEvent } from "./Input";
