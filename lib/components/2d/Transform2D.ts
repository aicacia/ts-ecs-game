import { mat2d, vec2 } from "gl-matrix";
import { composeMat2d, decomposeMat2d } from "../../external/math";
import { Component } from "../../sceneGraph";
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

  translate(offset: vec2) {
    vec2.add(this.localPosition, this.localPosition, offset);
    return this.setNeedsUpdate();
  }

  setLocalPosition(localPosition: vec2) {
    vec2.copy(this.localPosition, localPosition);
    return this.setNeedsUpdate();
  }
  getPosition() {
    return this.updateMatrixIfNeeded().position;
  }
  getLocalPosition() {
    return this.localPosition;
  }

  setLocalScale(localScale: vec2) {
    vec2.copy(this.localScale, localScale);
    return this.setNeedsUpdate();
  }
  getScale() {
    return this.updateMatrixIfNeeded().scale;
  }
  getLocalScale() {
    return this.localScale;
  }

  setLocalRotation(localRotation: number) {
    this.localRotation = localRotation;
    return this.setNeedsUpdate();
  }
  getRotation() {
    return this.updateMatrixIfNeeded().rotation;
  }
  getLocalRotation() {
    return this.localRotation;
  }

  getMatrix() {
    return this.updateMatrixIfNeeded().matrix;
  }
  getLocalMatrix() {
    return this.localMatrix;
  }

  setNeedsUpdate(needsUpdate: boolean = true) {
    if (needsUpdate !== this.needsUpdate) {
      this.needsUpdate = needsUpdate;
      this.getEntity().map(entity =>
        entity
          .getChildren()
          .forEach(child =>
            child
              .getComponent(Transform2D)
              .map(transform2d => transform2d.setNeedsUpdate(needsUpdate))
          )
      );
    }
    return this;
  }
  getNeedsUpdate() {
    return this.needsUpdate;
  }

  updateMatrixIfNeeded() {
    if (this.needsUpdate) {
      return this.updateMatrix();
    } else {
      return this;
    }
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
        parentTransform2d => {
          mat2d.mul(
            this.matrix,
            parentTransform2d.getMatrix(),
            this.localMatrix
          );
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
