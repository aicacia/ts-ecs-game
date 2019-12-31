import { vec2 } from "gl-matrix";
import { AABB2 } from "../../AABB2";
import { Shape } from "./Shape";

const VEC2_0 = vec2.create(),
  VEC2_1 = vec2.create(),
  VEC2_2 = vec2.create();

export class Capsule extends Shape {
  protected radius: number = 1.0;
  protected length: number = 1.0;

  getRadius() {
    return this.radius;
  }
  setRadius(radius: number) {
    this.radius = radius;
    return this;
  }

  getLength() {
    return this.length;
  }
  setLength(length: number) {
    this.length = length;
    return this;
  }

  update() {
    super.update();

    const matrix = this.getMatrix(),
      aabb = this.getAABB(),
      a = vec2.set(VEC2_0, 0, this.length * -0.5),
      b = vec2.set(VEC2_1, 0, this.length * 0.5),
      d = vec2.set(VEC2_2, this.radius, this.radius);

    vec2.transformMat2d(a, a, matrix);
    vec2.transformMat2d(b, b, matrix);

    vec2.sub(a, a, d);
    vec2.add(b, b, d);

    AABB2.setMin(aabb, vec2.min(VEC2_2, a, b));
    AABB2.setMax(aabb, vec2.max(VEC2_2, a, b));

    return this;
  }
}
