import { vec2, vec4 } from "gl-matrix";
import { equals } from "gl-matrix/cjs/common";
import { getAngleFromPoint } from "../../../external/math";
import { Component } from "../../../sceneGraph";
import { Transform2D } from "../Transform2D";
import { ArcManager } from "./ArcManager";

export enum Direction {
  CW = 1,
  CCW = -1
}

const ARC_VEC2_0 = vec2.create();

export class Arc extends Component {
  static componentName = "engine.Arc";
  static Manager = ArcManager;

  private radius: number = 1.0;
  private direction: Direction = Direction.CCW;
  private start: vec2 = vec2.fromValues(0, 1);
  private end: vec2 = vec2.fromValues(0, 1);
  private color: vec4 = vec4.fromValues(0, 0, 0, 1.0);

  getRadius() {
    return this.radius;
  }
  setRadius(radius: number) {
    this.radius = radius;
    return this;
  }

  getStart(out: vec2) {
    vec2.add(out, this.getRequiredComponent(Transform2D).getLocalPosition(), this.start);
    return out;
  }
  setStart(start: vec2) {
    vec2.normalize(this.start, start);
    return this;
  }
  getStartAngle() {
    return getAngleFromPoint(this.getStart(ARC_VEC2_0));
  }

  getEnd(out: vec2) {
    vec2.add(out, this.getRequiredComponent(Transform2D).getLocalPosition(), this.end);
    return out;
  }
  setEnd(end: vec2) {
    vec2.normalize(this.end, end);
    return this;
  }
  getEndAngle() {
    return getAngleFromPoint(this.getEnd(ARC_VEC2_0));
  }

  setDirection(direction: Direction) {
    this.direction = direction
    return this;
  }
  getDirection() {
    return this.direction;
  }

  setColor(color: vec4) {
    vec4.copy(this.color, color);
    return this;
  }
  getColor() {
    return this.color;
  }
}
