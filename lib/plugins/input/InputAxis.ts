import { clamp, sign } from "../../utils/math";
import { Time } from "../Time";

export class InputAxis {
  private name: string;

  private negButton: string;
  private posButton: string;

  private gravity: number = 3;
  private sensitivity: number = 3;

  private dead: number = 0.001;

  private value: number = 0.0;

  constructor(name: string, negButton: string, posButton: string) {
    this.name = name;
    this.negButton = negButton;
    this.posButton = posButton;
  }

  getName() {
    return this.name;
  }

  getNegButton() {
    return this.negButton;
  }
  setNegButton(negButton: string) {
    this.negButton = negButton;
    return this;
  }
  getPosButton() {
    return this.posButton;
  }
  setPosButton(posButton: string) {
    this.posButton = posButton;
    return this;
  }

  getGravity() {
    return this.gravity;
  }
  setGravity(gravity: number) {
    this.gravity = gravity;
    return this;
  }
  getSensitivity() {
    return this.sensitivity;
  }
  setSensitivity(sensitivity: number) {
    this.sensitivity = sensitivity;
    return this;
  }

  getDead() {
    return this.dead;
  }
  setDead(dead: number) {
    this.dead = dead;
    return this;
  }

  getValue() {
    return this.value;
  }
  UNSAFE_setValue(value: number) {
    this.value = value;
    return this;
  }

  UNSAFE_update(time: Time, value: number, isNeg: boolean, isPos: boolean) {
    const delta = time.getDelta();

    if (isNeg) {
      value -= this.getSensitivity() * delta;
    }
    if (isPos) {
      value += this.getSensitivity() * delta;
    }

    if (!isPos && !isNeg && value !== 0.0) {
      value -= sign(value) * this.getGravity() * delta;
    }

    value = clamp(value, -1.0, 1.0);

    if (Math.abs(value) <= this.getDead()) {
      value = 0.0;
    }

    this.value = value;
  }
}
