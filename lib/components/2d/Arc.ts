import { vec2, vec4 } from "gl-matrix";
import { getPointFromAngle, getTangentAngle } from "../../external/math";
import { Component } from "../../sceneGraph";
import { ArcManager } from "./ArcManager";
import { Transform2D } from "./Transform2D";

const VEC2_0 = vec2.create();

export class Arc extends Component {
  static componentName = "engine.Arc";
  static Manager = ArcManager;

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
    this.start = start % (Math.PI * 2);
    return this;
  }
  getStartPosition(out: vec2) {
    return this.getPositionFromAngel(out, this.start);
  }
  getStartRotation() {
    return getTangentAngle(this.getStartPosition(VEC2_0));
  }

  getEnd() {
    return this.end;
  }
  setEnd(end: number) {
    this.end = end % (Math.PI * 2);
    return this;
  }
  getEndPosition(out: vec2) {
    return this.getPositionFromAngel(out, this.end);
  }
  getEndRotation() {
    return getTangentAngle(this.getEndPosition(VEC2_0));
  }

  setColor(color: vec4) {
    vec4.copy(this.color, color);
    return this;
  }
  getColor() {
    return this.color;
  }

  private getPositionFromAngel(out: vec2, angle: number) {
    const transform2d = this.getRequiredComponent(Transform2D);
    getPointFromAngle(out, angle);
    vec2.scale(out, out, this.radius);
    vec2.transformMat2d(out, out, transform2d.getMatrix());
    return out;
  }
}
