import { vec2 } from "gl-matrix";
import { Shape } from "../shapes";

export class Contact {
  si: Shape;
  sj: Shape;
  position: vec2;
  normal: vec2;
  depth: number;

  constructor(
    si: Shape,
    sj: Shape,
    position: vec2,
    normal: vec2,
    depth: number
  ) {
    this.si = si;
    this.sj = sj;
    this.position = position;
    this.normal = normal;
    this.depth = depth;
  }
}
