import { none, Option, some } from "@stembord/core";
import { EventEmitter } from "events";
import { mat2d, vec2 } from "gl-matrix";
import { AABB2 } from "../../AABB2";
import { composeMat2d } from "../../math";
import { Body } from "../Body";

const SCALE = vec2.fromValues(1, 1);

export abstract class Shape extends EventEmitter {
  protected body: Option<Body> = none();
  protected aabb: AABB2 = AABB2.create();

  protected localPosition: vec2 = vec2.create();
  protected localRotation: number = 0;

  protected position: vec2 = vec2.create();
  protected rotation: number = 0;

  protected needsUpdate = true;
  protected matrix: mat2d = mat2d.create();

  UNSAFE_setBody(body: Body) {
    this.body = some(body);
    return this;
  }
  getBody() {
    return this.body;
  }

  getAABB() {
    return this.aabb;
  }

  getPosition() {
    return this.position;
  }
  getLocalPosition() {
    return this.position;
  }
  setPosition(position: vec2) {
    vec2.copy(this.localPosition, position);
    return this.setNeedsUpdate();
  }

  getLocalRotation() {
    return this.localRotation;
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

  update(): ThisType<this> {
    this.body.map(body => {
      vec2.add(this.position, body.getPosition(), this.localPosition);
      this.rotation = body.getRotation() + this.localRotation;
      this.needsUpdate = true;
    });
    return this;
  }

  updateMatrix() {
    this.needsUpdate = false;
    composeMat2d(this.matrix, this.position, SCALE, this.rotation);
    return this;
  }
}
