import { vec2 } from "gl-matrix";
import { Component, Entity } from "../../../sceneGraph";
import { angleVec2 } from "../../../utils/math";
import { Transform2D } from "../../transform2d";
import { Line } from "../line";
import { AngleManager } from "./AngleManager";

const VEC2_0 = vec2.create(),
  VEC2_1 = vec2.create();

export enum AngleSide {
  Inner = "Inner",
  Outer = "Outer"
}

export class Angle extends Component {
  static componentName = "engine.Angle";
  static Manager = AngleManager;

  private a: Entity;
  private b: Entity;
  private side: AngleSide = AngleSide.Inner;

  private radius: number = 0.0;
  private start: number = 0.0;
  private end: number = 0.0;

  constructor(a: Entity, b: Entity) {
    super();

    this.a = a;
    this.b = b;
  }

  getA() {
    return this.a;
  }
  getB() {
    return this.b;
  }

  getSide() {
    return this.side;
  }
  setSide(side: AngleSide) {
    this.side = side;
    return this;
  }

  getRadius() {
    return this.radius;
  }
  getStart() {
    return this.start;
  }
  getEnd() {
    return this.end;
  }

  onUpdate() {
    const transform = this.getComponent(Transform2D).expect(
      "angle should alwyas have a transform component"
    );

    this.a.getComponent(Line).flatMap(a =>
      this.b.getComponent(Line).map(b => {
        const aLength = a.getLength(),
          bLength = b.getLength(),
          length = aLength > bLength ? bLength : aLength,
          aLine = a.getLine(VEC2_0),
          bLine = b.getLine(VEC2_1),
          startAngle = angleVec2(aLine) - Math.PI,
          distanceAngle = vec2.angle(aLine, bLine),
          endAngle = startAngle + distanceAngle;

        this.radius = length * 0.25;

        if (this.side === AngleSide.Inner) {
          this.start = startAngle;
          this.end = endAngle;
        } else {
          this.start = endAngle;
          this.end = startAngle;
        }

        transform.setLocalPosition(a.getEndPosition());
      })
    );
    return this;
  }
}
