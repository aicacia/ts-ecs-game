import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";
import { mat2d, vec2 } from "gl-matrix";
import { AABB2 } from "../../AABB2";
import { composeMat2d, decomposeMat2d } from "../../math";
import { Body } from "../Body";

const VEC2_0 = vec2.fromValues(1, 1),
  MAT2D_0 = mat2d.create();

export abstract class Shape extends EventEmitter {
  private body: Option<Body> = none();
  private aabb: AABB2 = AABB2.create();

  private localPosition: vec2 = vec2.create();
  private localRotation: number = 0;

  private position: vec2 = vec2.create();
  private rotation: number = 0;

  private matrix: mat2d = mat2d.create();

  private needsUpdate = true;

  UNSAFE_setBody(body: Body) {
    this.body = some(body);
    return this;
  }
  getBody() {
    return this.body;
  }

  getAABB() {
    return this.updateIfNeeded().aabb;
  }

  getPosition() {
    return this.updateIfNeeded().position;
  }
  getLocalPosition() {
    return this.position;
  }
  setLocalPosition(position: vec2) {
    vec2.copy(this.localPosition, position);
    return this.setNeedsUpdate();
  }

  getLocalRotation() {
    return this.localRotation;
  }
  getRotation() {
    return this.updateIfNeeded().rotation;
  }
  setLocalRotation(localRotation: number) {
    this.localRotation = localRotation;
    return this.setNeedsUpdate();
  }

  setNeedsUpdate(needsUpdate: boolean = true) {
    if (needsUpdate !== this.needsUpdate) {
      this.needsUpdate = needsUpdate;
      this.body.map(body => body.setAABBNeedsUpdate(needsUpdate));
    }
    return this;
  }
  getNeedsUpdate() {
    return this.needsUpdate;
  }

  getMatrix() {
    return this.updateIfNeeded().matrix;
  }

  updateIfNeeded() {
    if (this.getNeedsUpdate()) {
      return this.update();
    } else {
      return this;
    }
  }

  update() {
    this.needsUpdate = false;

    const localMatrix = MAT2D_0;

    composeMat2d(localMatrix, this.localPosition, VEC2_0, this.localRotation);

    this.body.mapOrElse(
      body => mat2d.mul(this.matrix, body.getMatrix(), localMatrix),
      () => mat2d.copy(this.matrix, localMatrix)
    );

    this.rotation = decomposeMat2d(this.matrix, this.position, VEC2_0);

    return this;
  }
}
