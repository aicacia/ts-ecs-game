import { vec2 } from "gl-matrix";
import { Convex } from "./Convex";

export class Box extends Convex {
  protected points: vec2[] = [
    vec2.fromValues(-0.5, 0.5),
    vec2.fromValues(0.5, 0.5),
    vec2.fromValues(0.5, -0.5),
    vec2.fromValues(-0.5, -0.5)
  ];

  set(width: number, height: number) {
    const halfWidth = width * 0.5,
      halfHeight = height * 0.5;

    vec2.set(this.points[0], -halfWidth, halfHeight);
    vec2.set(this.points[1], halfWidth, halfHeight);
    vec2.set(this.points[2], halfWidth, -halfHeight);
    vec2.set(this.points[3], -halfWidth, -halfHeight);

    return this;
  }
}
