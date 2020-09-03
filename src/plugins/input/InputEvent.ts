export class InputEvent<T extends string = string> {
  type: T;

  constructor(type: T) {
    this.type = type;
  }
}
