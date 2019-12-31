import { EventEmitter } from "events";
import { mat2d, vec2 } from "gl-matrix";
import { AABB2 } from "../AABB2";
import { composeMat2d } from "../math";
import { Shape } from "./shapes";

const SCALE2 = vec2.fromValues(1, 1);

export class Body extends EventEmitter {
  private shapes: Shape[] = [];
  private aabb: AABB2 = AABB2.create();

  private position: vec2 = vec2.create();
  private rotation: number = 0;

  private matrix: mat2d = mat2d.create();

  private needsUpdate: boolean = false;
  private aabbNeedsUpdate: boolean = false;

  getAABB() {
    return this.updateAABBIfNeeded().aabb;
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
    if (needsUpdate !== this.needsUpdate) {
      this.needsUpdate = needsUpdate;
      this.setAABBNeedsUpdate(needsUpdate);
    }
    return this;
  }
  getNeedsUpdate() {
    return this.needsUpdate;
  }

  setAABBNeedsUpdate(aabbNeedsUpdate: boolean = true) {
    if (aabbNeedsUpdate !== this.aabbNeedsUpdate) {
      this.aabbNeedsUpdate = aabbNeedsUpdate;
      this.shapes.forEach(shape => shape.setNeedsUpdate(aabbNeedsUpdate));
    }
    return this;
  }
  getAABBNeedsUpdate() {
    return this.aabbNeedsUpdate;
  }

  getMatrix() {
    return this.updateMatrixIfNeeded().matrix;
  }

  updateMatrixIfNeeded() {
    if (this.getNeedsUpdate()) {
      return this.updateMatrix();
    } else {
      return this;
    }
  }
  updateMatrix() {
    this.needsUpdate = false;
    composeMat2d(this.matrix, this.position, SCALE2, this.rotation);
    return this;
  }

  updateAABBIfNeeded() {
    if (this.getAABBNeedsUpdate()) {
      return this.updateAABB();
    } else {
      return this;
    }
  }
  updateAABB() {
    this.aabbNeedsUpdate = false;
    this.shapes.reduce((aabb, shape) => {
      AABB2.union(aabb, aabb, shape.getAABB());
      return aabb;
    }, AABB2.identity(this.aabb));
    return this;
  }

  addShapes(shapes: Shape[]) {
    shapes.forEach(shape => this._addShape(shape));
    return this;
  }
  addShape(...shapes: Shape[]) {
    return this.addShapes(shapes);
  }

  update(delta: number) {
    return this;
  }

  private _addShape<S extends Shape>(shape: S) {
    shape.UNSAFE_setBody(this);
    this.shapes.push(shape);
    return this;
  }
}
