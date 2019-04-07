import { mat2d, vec2 } from "gl-matrix";
import { composeMat2d } from "../../utils";
import { AABB2 } from "../AABB2";
import { Shape } from "./shapes";

const SCALE2 = vec2.fromValues(1, 1);

export class Body {
  private shapes: Shape[] = [];
  private aabb: AABB2 = AABB2.create();

  private position: vec2 = vec2.create();
  private rotation: number = 0;

  private matrix: mat2d = mat2d.create();

  private needsUpdate: boolean = false;

  getAABB() {
    return this.aabb;
  }
  getShapes(): ReadonlyArray<Shape> {
    return this.shapes;
  }

  getPosition() {
    return this.position;
  }
  setPosition(position: vec2) {
    vec2.copy(this.position, position);
    return this.setNeedsUpdate();
  }

  getRotation() {
    return this.rotation;
  }
  setRotation(rotation: number) {
    this.rotation = rotation;
    return this.setNeedsUpdate();
  }

  setNeedsUpdate(needsUpdate: boolean = true) {
    this.needsUpdate = needsUpdate;
    return this;
  }

  getMatrix() {
    if (this.needsUpdate) {
      this.updateMatrix();
    }
    return this.matrix;
  }

  addShapes(shapes: Shape[]) {
    shapes.forEach(shape => this._addShape(shape));
    return this;
  }
  addShape(...shapes: Shape[]) {
    return this.addShapes(shapes);
  }

  update() {
    this.updateAABB();
    return this;
  }

  private updateMatrix() {
    this.needsUpdate = false;
    composeMat2d(this.matrix, this.position, SCALE2, this.rotation);
    return this;
  }

  private updateAABB() {
    this.shapes.reduce((aabb, shape) => {
      shape.updateAABB(this.getMatrix());
      return aabb;
    }, AABB2.identity(this.aabb));
    return this;
  }

  private _addShape<S extends Shape>(shape: S) {
    this.shapes.push(shape);
    return this;
  }
}
