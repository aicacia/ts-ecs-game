import { mat2d, vec2 } from "gl-matrix";
import { Shape } from "./Shape";

export class Circle extends Shape {
  private radius: number = 1.0;

  getRadius() {
    return this.radius;
  }
  setRadius(radius: number) {
    this.radius = radius;
    return this;
  }

  updateAABB(matrix: mat2d) {
    this.aabb.min[0] = -this.radius;
    this.aabb.min[1] = -this.radius;
    this.aabb.max[0] = this.radius;
    this.aabb.max[1] = this.radius;

    vec2.transformMat2d(this.aabb.min, this.aabb.min, matrix);
    vec2.transformMat2d(this.aabb.max, this.aabb.max, matrix);

    return this;
  }
}
