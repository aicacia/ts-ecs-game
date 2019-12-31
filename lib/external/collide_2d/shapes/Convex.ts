import { vec2 } from "gl-matrix";
import { AABB2 } from "../../AABB2";
import { Shape } from "./Shape";

const VEC2_0 = vec2.create();

export class Convex extends Shape {
  protected points: vec2[] = [];

  getPoints() {
    return this.points;
  }
  setPoints(points: vec2[]) {
    this.points = points;
    return this;
  }

  update() {
    super.update();

    const aabb = this.getAABB(),
      matrix = this.getMatrix();

    this.points.forEach(point =>
      AABB2.expandPoint(aabb, aabb, vec2.transformMat2d(VEC2_0, point, matrix))
    );

    return this;
  }
}
