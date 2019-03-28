import { vec2 } from "gl-matrix";

export class AABB2 {
  static create() {
    return new AABB2();
  }

  static fromValues(min: vec2, max: vec2) {
    return AABB2.set(AABB2.create(), min, max);
  }

  static set(out: AABB2, min: vec2, max: vec2) {
    AABB2.setMin(out, min);
    AABB2.setMax(out, max);
    return out;
  }
  static setMin(out: AABB2, min: vec2) {
    vec2.copy(out.min, min);
    return out;
  }
  static setMax(out: AABB2, max: vec2) {
    vec2.copy(out.max, max);
    return out;
  }

  static identity(out: AABB2) {
    vec2.set(out.min, Infinity, Infinity);
    vec2.set(out.max, -Infinity, -Infinity);
    return out;
  }

  min: vec2 = vec2.fromValues(Infinity, Infinity);
  max: vec2 = vec2.fromValues(-Infinity, -Infinity);
}
