export class InputButton {
  private name: string;
  private value: number = 0.0;
  private frameDown: number = 0;
  private frameUp: number = 0;

  constructor(name: string) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  getFrameDown() {
    return this.frameDown;
  }
  getFrameUp() {
    return this.frameUp;
  }

  getValue() {
    return this.value;
  }
  UNSAFE_setValue(value: number) {
    this.value = value;
    return this;
  }

  UNSAFE_up(frame: number) {
    this.value = 0.0;
    this.frameUp = frame;
    return this;
  }
  UNSAFE_down(frame: number) {
    this.value = 1.0;
    this.frameDown = frame;
    return this;
  }
}
