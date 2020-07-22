import { mat2d, mat4, quat, vec2, vec3 } from "gl-matrix";
import {
  composeMat2d,
  decomposeMat2d,
  getAngleBetweenPoints,
} from "../../math";
import { TransformComponent } from "../TransformComponent";
import { Transform2DManager } from "./Transform2DManager";

const VEC2_0 = vec2.create(),
  VEC3_UP = vec3.fromValues(0, 0, 1),
  MAT2_0 = mat2d.create();

export class Transform2D extends TransformComponent {
  static Manager = Transform2DManager;

  private localPosition: vec2 = vec2.create();
  private localScale: vec2 = vec2.fromValues(1, 1);
  private localRotation: number = 0.0;
  private localMatrix: mat2d = mat2d.create();

  private position: vec2 = vec2.create();
  private scale: vec2 = vec2.fromValues(1, 1);
  private rotation: number = 0.0;
  private matrix: mat2d = mat2d.create();

  getLocalPosition2(out: vec2) {
    return vec2.copy(out, this.getLocalPosition());
  }
  getLocalPosition3(out: vec3) {
    const localPosition = this.getLocalPosition();
    out[0] = localPosition[0];
    out[1] = localPosition[1];
    return out;
  }

  setLocalPosition2(localPosition: vec2) {
    return this.setLocalPosition(localPosition);
  }
  setLocalPosition3(localPosition: vec3) {
    return this.setLocalPosition(
      vec2.set(VEC2_0, localPosition[0], localPosition[1])
    );
  }

  getPosition2(out: vec2) {
    return vec2.copy(out, this.getPosition());
  }
  getPosition3(out: vec3) {
    const position = this.getPosition();
    out[0] = position[0];
    out[1] = position[1];
    return out;
  }

  getLocalRotationZ() {
    return this.getLocalRotation();
  }
  getLocalRotationQuat(out: quat) {
    return quat.fromEuler(out, 0, 0, this.getLocalRotation());
  }

  setLocalRotationZ(localRotation: number) {
    return this.setLocalRotation(localRotation);
  }
  setLocalRotationQuat(localRotation: quat) {
    return this.setLocalRotation(quat.getAxisAngle(VEC3_UP, localRotation));
  }

  getRotationZ() {
    return this.getRotation();
  }
  getRotationQuat(out: quat) {
    return quat.fromEuler(out, 0, 0, this.getRotation());
  }

  getLocalScale2(out: vec2) {
    return vec2.copy(out, this.getLocalScale());
  }
  getLocalScale3(out: vec3) {
    const localScale = this.getLocalScale();
    out[0] = localScale[0];
    out[1] = localScale[1];
    return out;
  }

  setLocalScale2(localScale: vec2) {
    return this.setLocalScale(localScale);
  }
  setLocalScale3(localScale: vec3) {
    return this.setLocalScale(vec2.set(VEC2_0, localScale[0], localScale[1]));
  }

  getScale2(out: vec2) {
    return vec2.copy(out, this.getScale());
  }
  getScale3(out: vec3) {
    const scale = this.getScale();
    out[0] = scale[0];
    out[1] = scale[1];
    return out;
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
    return this.updateLocalMatrixIfNeeded().localMatrix;
  }

  updateLocalMatrix() {
    this.localNeedsUpdate = false;

    composeMat2d(
      this.localMatrix,
      this.localPosition,
      this.localScale,
      this.localRotation
    );

    return this;
  }

  updateMatrix() {
    this.needsUpdate = false;

    this.updateLocalMatrixIfNeeded();

    this.getParentTransform().mapOrElse(
      (parentTransform) => {
        mat2d.mul(
          this.matrix,
          parentTransform.getMatrix2d(MAT2_0),
          this.localMatrix
        );
        this.rotation = decomposeMat2d(this.matrix, this.position, this.scale);
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

  getMatrix4(out: mat4) {
    const matrix = this.getMatrix();
    return mat4.set(
      out,
      matrix[0],
      matrix[1],
      0.0,
      matrix[4],
      matrix[2],
      matrix[3],
      0.0,
      matrix[5],
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0
    );
  }
  getMatrix2d(out: mat2d) {
    return mat2d.copy(out, this.getMatrix());
  }

  // TODO: this makes no sense, position is global but it works! why?
  lookAt(position: vec2) {
    return this.setLocalRotation(
      getAngleBetweenPoints(this.localPosition, position)
    );
  }
}
