import { mat2d, vec2 } from "gl-matrix";
import { AABB2 } from "../../AABB2";

export abstract class Shape {
  protected aabb: AABB2 = AABB2.create();
  protected position: vec2 = vec2.create();
  protected rotation: number = 0;

  getAABB() {
    return this.aabb;
  }

  getPosition() {
    return this.position;
  }
  setPosition(position: vec2) {
    vec2.copy(this.position, position);
    return this;
  }

  getRotation() {
    return this.rotation;
  }
  setRotation(rotation: number) {
    this.rotation = rotation;
    return this;
  }

  abstract updateAABB(matrix: mat2d): ThisType<this>;
}
