import { vec2, vec4 } from "gl-matrix";
import { Component } from "../../sceneGraph";
import { getPointFromAngle } from "../../utils/math";
import { ArcManager } from "./ArcManager";
import { Transform2D } from "./Transform2D";

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
    this.start = start;
    return this;
  }
  getStartPosition(out: vec2) {
    return this.getPositionFromAngel(out, this.start);
  }

  getEnd() {
    return this.end;
  }
  setEnd(end: number) {
    this.end = end;
    return this;
  }
  getEndPosition(out: vec2) {
    return this.getPositionFromAngel(out, this.end);
  }

  setColor(color: vec4) {
    vec4.copy(this.color, color);
    return this;
  }
  getColor() {
    return this.color;
  }

  private getPositionFromAngel(out: vec2, angle: number) {
    const transform2d = this.getComponent(Transform2D).expect(
      "Arc Component requires Transform2D"
    );
    getPointFromAngle(out, angle);
    vec2.scale(out, out, this.radius);
    vec2.transformMat2d(out, out, transform2d.getMatrix());
    return out;
  }
}
