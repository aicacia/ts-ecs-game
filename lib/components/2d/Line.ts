import { vec2, vec4 } from "gl-matrix";
import { Component } from "../../sceneGraph";
import { LineManager } from "./LineManager";
import { Transform2D } from "./Transform2D";

const VEC2_0 = vec2.create();

export enum LineType {
  Normal = "Normal",
  Dashed = "Dashed",
  Dotted = "Dotted"
}

export class Line extends Component {
  static componentName = "engine.Line";
  static Manager = LineManager;

  private length: number = 1.0;
  private lineWidth: number = 1.0;
  private type: LineType = LineType.Normal;
  private color: vec4 = vec4.fromValues(0, 0, 0, 1.0);

  setLength(length: number) {
    this.length = length;
    return this;
  }
  getLength() {
    return this.length;
  }

  setLineWidth(lineWidth: number) {
    this.lineWidth = lineWidth;
    return this;
  }
  getLineWidth() {
    return this.lineWidth;
  }

  setType(type: LineType) {
    this.type = type;
    return this;
  }
  getType() {
    return this.type;
  }

  setColor(color: vec4) {
    vec4.copy(this.color, color);
    return this;
  }
  getColor() {
    return this.color;
  }

  getStart(out: vec2) {
    const transform2d = this.getRequiredComponent(Transform2D);
    vec2.copy(out, transform2d.getPosition());
    return out;
  }
  getEnd(out: vec2) {
    const transform2d = this.getRequiredComponent(Transform2D),
      angle = transform2d.getRotation();

    vec2.copy(out, transform2d.getPosition());
    vec2.set(VEC2_0, Math.cos(angle), Math.sin(angle));
    vec2.scale(VEC2_0, VEC2_0, this.length);
    vec2.add(out, out, VEC2_0);

    return out;
  }
}
