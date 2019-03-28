import { mat2d, vec2 } from "gl-matrix";
import { AABB2 } from "../../utils";
import { Shape } from "./shapes";

export class Body {
  private shapes: Shape[] = [];
  private aabb: AABB2 = AABB2.create();
  private position: vec2 = vec2.create();
  private rotation: number = 0;
  private matrix: mat2d = mat2d.create();

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

  getMatrix() {
    return this.matrix;
  }

  addShapes(shapes: Shape[]) {
    shapes.forEach(shape => this._addShape(shape));
    return this;
  }
  addShape(...shapes: Shape[]) {
    return this.addShapes(shapes);
  }

  update() {}

  private updateAABB() {
    this.shapes.reduce((aabb, shape) => aabb, AABB2.identity(this.aabb));
    return this;
  }

  private _addShape<S extends Shape>(shape: S) {
    this.shapes.push(shape);
    return this;
  }
}
