export class InputButton {
  private name: string;
  private value: number = 0.0;

  constructor(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  getValue() {
    return this.value;
  }
  UNSAFE_setValue(value: number) {
    this.value = value;
    return this;
  }
}
