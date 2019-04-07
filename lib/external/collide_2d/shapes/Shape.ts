import { none, Option, some } from "@aicacia/core";
import { EventEmitter } from "events";
import { vec2 } from "gl-matrix";
import { AABB2 } from "../../AABB2";
import { Body } from "../Body";

export abstract class Shape extends EventEmitter {
  protected body: Option<Body> = none();
  protected aabb: AABB2 = AABB2.create();

  protected localPosition: vec2 = vec2.create();
  protected localRotation: number = 0;

  protected position: vec2 = vec2.create();
  protected rotation: number = 0;

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
    return this;
  }

  getLocalRotation() {
    return this.localRotation;
  }
  getRotation() {
    return this.rotation;
  }
  setRotation(rotation: number) {
    this.rotation = rotation;
    return this;
  }

  update(): ThisType<this> {
    this.body.map(body => {
      vec2.add(this.position, body.getPosition(), this.localPosition);
      this.rotation = body.getRotation() + this.localRotation;
    });
    return this;
  }
}
