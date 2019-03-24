import { vec4 } from "gl-matrix";
import { Component } from "../../../sceneGraph";
import { AngleManager } from "./AngleManager";

export class Angle extends Component {
  static componentName = "engine.Angle";
  static Manager = AngleManager;

  private radius: number = 1.0;
  private start: number = 0.0;
  private end: number = Math.PI * 2.0;
  private color: vec4 = vec4.fromValues(0, 0, 0, 1.0);

  getRadius() {
    return this.radius;
  }
  setRadius(radius: number) {
    this.radius = radius;
    return this;
  }

  getStart() {
    return this.start;
  }
  setStart(start: number) {
    this.start = start;
    return this;
  }

  getEnd() {
    return this.end;
  }
  setEnd(end: number) {
    this.end = end;
    return this;
  }

  setColor(color: vec4) {
    vec4.copy(this.color, color);
    return this;
  }
  getColor() {
    return this.color;
  }
}
