import { mat2d, vec2 } from "gl-matrix";
import { Component } from "../../sceneGraph";
import { composeMat2d, decomposeMat2d } from "../../utils";
import { Transform2DManager } from "./Transform2DManager";

export class Transform2D extends Component {
  static componentName = "engine.Transform2D";
  static Manager = Transform2DManager;

  private localPosition: vec2 = vec2.create();
  private localScale: vec2 = vec2.fromValues(1, 1);
  private localRotation: number = 0.0;
  private localMatrix: mat2d = mat2d.create();

  private position: vec2 = vec2.create();
  private scale: vec2 = vec2.fromValues(1, 1);
  private rotation: number = 0.0;
  private matrix: mat2d = mat2d.create();

  private needsUpdate: boolean = true;

  setLocalPosition(localPosition: vec2) {
    vec2.copy(this.localPosition, localPosition);
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

  setLocalScale(localScale: vec2) {
    vec2.copy(this.localScale, localScale);
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

  setLocalRotation(localRotation: number) {
    this.localRotation = localRotation;
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
    this.needsUpdate = false;

    composeMat2d(
      this.localMatrix,
      this.localPosition,
      this.localScale,
      this.localRotation
    );

    this.getEntity()
      .flatMap(entity => entity.getParent())
      .flatMap(parent => parent.getComponent(Transform2D))
      .mapOrElse(
        transform2d => {
          mat2d.mul(this.matrix, transform2d.getMatrix(), this.localMatrix);
          this.rotation = decomposeMat2d(
            this.matrix,
            this.position,
            this.scale
          );
        },
        () => {
          mat2d.copy(this.matrix, this.localMatrix);
          vec2.copy(this.position, this.localPosition);
          vec2.copy(this.scale, this.localScale);
          this.rotation = this.localRotation;
        }
      );

    return this;
  }
}
