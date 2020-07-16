import { mat2d, mat4, quat, vec2, vec3 } from "gl-matrix";
import { TransformComponent } from "../TransformComponent";
import { Transform3DManager } from "./Transform3DManager";

const MAT4_0 = mat4.create(),
  VEC3_0 = vec3.create(),
  VEC3_UP = vec3.fromValues(0.0, 0.0, 1.0);

export class Transform3D extends TransformComponent {
  static Manager = Transform3DManager;

  private localPosition: vec3 = vec3.create();
  private localScale: vec3 = vec3.fromValues(1, 1, 1);
  private localRotation: quat = quat.identity(quat.create());
  private localMatrix: mat4 = mat4.create();

  private position: vec3 = vec3.create();
  private scale: vec3 = vec3.fromValues(1, 1, 1);
  private rotation: quat = quat.identity(quat.create());
  private matrix: mat4 = mat4.create();

  getLocalPosition3(out: vec3) {
    return vec3.copy(out, this.localPosition);
  }
  getLocalPosition2(out: vec2) {
    out[0] = this.localPosition[0];
    out[1] = this.localPosition[1];
    return out;
  }

  setLocalPosition2(localPosition: vec2) {
    this.localPosition[0] = localPosition[0];
    this.localPosition[1] = localPosition[1];
    return this;
  }
  setLocalPosition3(localPosition: vec3) {
    return this.setLocalPosition(localPosition);
  }

  getPosition3(out: vec3) {
    return vec3.copy(out, this.getPosition());
  }
  getPosition2(out: vec2) {
    const position = this.getPosition();
    out[0] = position[0];
    out[1] = position[1];
    return out;
  }

  getLocalRotationQuat(out: quat) {
    return quat.copy(out, this.localRotation);
  }
  getLocalRotationZ() {
    return quat.getAxisAngle(VEC3_UP, this.localRotation);
  }

  setLocalRotationZ(localRotation: number) {
    quat.rotateZ(this.localRotation, this.localRotation, localRotation);
    return this;
  }
  setLocalRotationQuat(localRotation: quat) {
    return this.setLocalRotation(localRotation);
  }

  getRotationQuat(out: quat) {
    return quat.copy(out, this.getRotation());
  }
  getRotationZ() {
    return quat.getAxisAngle(VEC3_UP, this.getRotation());
  }

  getLocalScale3(out: vec3) {
    return vec3.copy(out, this.localScale);
  }
  getLocalScale2(out: vec2) {
    out[0] = this.localScale[0];
    out[1] = this.localScale[1];
    return out;
  }

  setLocalScale2(localScale: vec2) {
    this.localPosition[0] = localScale[0];
    this.localPosition[1] = localScale[1];
    return this;
  }
  setLocalScale3(localScale: vec3) {
    return this.setLocalScale(localScale);
  }

  getScale3(out: vec3) {
    return vec3.copy(out, this.getScale());
  }
  getScale2(out: vec2) {
    const scale = this.getScale();
    out[0] = scale[0];
    out[1] = scale[1];
    return out;
  }

  translate(offset: vec3) {
    vec3.add(this.localPosition, this.localPosition, offset);
    return this.setNeedsUpdate();
  }

  setLocalPosition(localPosition: vec3) {
    vec3.copy(this.localPosition, localPosition);
    return this.setNeedsUpdate();
  }
  getPosition() {
    return this.updateMatrixIfNeeded().position;
  }
  getLocalPosition() {
    return this.localPosition;
  }

  setLocalScale(localScale: vec3) {
    vec3.copy(this.localScale, localScale);
    return this.setNeedsUpdate();
  }
  getScale() {
    return this.updateMatrixIfNeeded().scale;
  }
  getLocalScale() {
    return this.localScale;
  }

  setLocalRotation(localRotation: quat) {
    quat.copy(this.localRotation, localRotation);
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
    return this.updateMatrixIfNeeded().localMatrix;
  }

  updateLocalMatrix() {
    this.localNeedsUpdate = false;

    mat4.fromRotationTranslationScale(
      this.localMatrix,
      this.localRotation,
      this.localPosition,
      this.localScale
    );

    return this;
  }

  updateMatrix() {
    this.needsUpdate = false;

    this.updateLocalMatrix();

    this.getParentTransform().mapOrElse(
      (parentTransform) => {
        mat4.mul(
          this.matrix,
          parentTransform.getMatrix4(MAT4_0),
          this.localMatrix
        );
        mat4.getRotation(this.rotation, this.matrix);
        mat4.getScaling(this.scale, this.matrix);
        mat4.getTranslation(this.position, this.matrix);
      },
      () => {
        mat4.copy(this.matrix, this.localMatrix);
        vec3.copy(this.position, this.localPosition);
        vec3.copy(this.scale, this.localScale);
        quat.copy(this.rotation, this.localRotation);
      }
    );

    return this;
  }

  getMatrix4(out: mat4) {
    return mat4.copy(out, this.getMatrix());
  }
  getMatrix2d(out: mat2d) {
    const matrix = this.getMatrix();
    return mat2d.set(
      out,
      matrix[0],
      matrix[1],
      matrix[4],
      matrix[5],
      matrix[13],
      matrix[14]
    );
  }

  lookAt(position: vec3) {
    let inverseMatrix = mat4.invert(MAT4_0, this.getMatrix());
    if (inverseMatrix == null) {
      inverseMatrix = mat4.identity(MAT4_0);
    }
    const localPosition = vec3.transformMat4(VEC3_0, position, inverseMatrix);
    mat4.getRotation(
      this.localRotation,
      mat4.lookAt(MAT4_0, this.localPosition, localPosition, VEC3_UP)
    );
    return this.setNeedsUpdate();
  }
}
