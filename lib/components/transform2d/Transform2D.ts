import { mat2d, vec2 } from "gl-matrix";
import { Component, Entity } from "../../sceneGraph";

const VEC2_0 = vec2.create();

export class Transform2D extends Component {
  static Manager = null as any;
  static componentName = "engine.Transform2D";

  localPosition: vec2 = vec2.create();
  localScale: vec2 = vec2.fromValues(1, 1);
  localRotation: number = 0.0;
  localMatrix: mat2d = mat2d.create();

  position: vec2 = vec2.create();
  scale: vec2 = vec2.fromValues(1, 1);
  rotation: number = 0.0;
  matrix: mat2d = mat2d.create();

  private needsUpdate: boolean = true;

  setPosition(position: vec2) {
    vec2.copy(this.localPosition, position);
    return this.setNeedsUpdate();
  }
  getPosition() {
    if (this.getNeedsUpdate()) {
      this.updateMatrix();
    }
    return this.position;
  }
  getLocalPosition() {
    return this.localPosition;
  }

  setScale(scale: vec2) {
    vec2.copy(this.localScale, scale);
    return this.setNeedsUpdate();
  }
  getScale() {
    if (this.getNeedsUpdate()) {
      this.updateMatrix();
    }
    return this.scale;
  }
  getLocalScale() {
    return this.localScale;
  }

  setRotation(rotation: number) {
    this.rotation = rotation;
    return this.setNeedsUpdate();
  }
  getRotation() {
    if (this.getNeedsUpdate()) {
      this.updateMatrix();
    }
    return this.rotation;
  }
  getLocalRotation() {
    return this.localRotation;
  }

  getMatrix() {
    if (this.needsUpdate) {
      this.updateMatrix();
    }
    return this.matrix;
  }
  getLocalMatrix() {
    return this.localMatrix;
  }

  setNeedsUpdate(needsUpdate: boolean = true) {
    this.needsUpdate = needsUpdate;
    return this;
  }
  getNeedsUpdate() {
    return this.needsUpdate;
  }

  updateMatrix() {
    let hasParent = false;

    this.needsUpdate = false;

    mat2d.identity(this.localMatrix);
    mat2d.rotate(this.localMatrix, this.localMatrix, this.localRotation);
    mat2d.scale(this.localMatrix, this.localMatrix, this.localScale);
    mat2d.translate(this.localMatrix, this.localMatrix, this.localPosition);

    this.entity
      .flatMap(entity => entity.getParent())
      .flatMap(parent => parent.getComponent(Transform2D))
      .map(transform2d => {
        hasParent = true;
        mat2d.mul(this.matrix, transform2d.getMatrix(), this.localMatrix);
      });

    if (hasParent) {
      vec2.set(this.position, this.matrix[2], this.matrix[5]);

      const x = vec2.len(vec2.set(VEC2_0, this.matrix[0], this.matrix[3])),
        y = vec2.len(vec2.set(VEC2_0, this.matrix[1], this.matrix[4]));

      vec2.set(this.scale, x, y);
      this.rotation = Math.atan2(this.matrix[3], this.matrix[0]);
    } else {
      mat2d.copy(this.matrix, this.localMatrix);
      vec2.copy(this.position, this.localPosition);
      vec2.copy(this.scale, this.localScale);
      this.rotation = this.localRotation;
    }

    return this;
  }
}

import { Transform2DManager } from "./Transform2DManager";

Transform2D.Manager = Transform2DManager;
