import { Option } from "@aicacia/core";
import { mat2d, mat4, quat, vec3 } from "gl-matrix";
import { Entity } from "../../sceneGraph";
import { RenderableComponent } from "../RenderableComponent";
import { Transform3DManager } from "./Transform3DManager";

const MAT4_0 = mat4.create(),
  VEC3_0 = vec3.create(),
  VEC3_UP = vec3.fromValues(0.0, 0.0, 1.0);

export class Transform3D extends RenderableComponent {
  static componentName = "engine.Transform3D";
  static Manager = Transform3DManager;

  private localPosition: vec3 = vec3.create();
  private localScale: vec3 = vec3.fromValues(1, 1, 1);
  private localRotation: quat = quat.identity(quat.create());
  private localMatrix: mat4 = mat4.create();

  private position: vec3 = vec3.create();
  private scale: vec3 = vec3.fromValues(1, 1, 1);
  private rotation: quat = quat.identity(quat.create());
  private matrix: mat4 = mat4.create();

  private needsUpdate: boolean = true;
  private localNeedsUpdate: boolean = true;

  onDetach() {
    return this.setNeedsUpdate();
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

  setNeedsUpdate(needsUpdate: boolean = true) {
    this.setLocalNeedsUpdate(needsUpdate);

    if (needsUpdate !== this.needsUpdate) {
      this.needsUpdate = needsUpdate;
      this.getEntity().map(entity =>
        entity.getChildren().forEach(child => {
          child
            .getComponent(Transform2D)
            .map(transform2d => transform2d.setNeedsUpdate(needsUpdate));
          child
            .getComponent(Transform3D)
            .map(transform3d => transform3d.setNeedsUpdate(needsUpdate));
        })
      );
    }
    return this;
  }
  getNeedsUpdate() {
    return this.needsUpdate;
  }

  setLocalNeedsUpdate(localNeedsUpdate: boolean = true) {
    this.localNeedsUpdate = localNeedsUpdate;
    return this;
  }
  getLocalNeedsUpdate() {
    return this.localNeedsUpdate;
  }

  updateLocalMatrixIfNeeded() {
    if (this.localNeedsUpdate) {
      return this.updateLocalMatrix();
    } else {
      return this;
    }
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

  updateMatrixIfNeeded() {
    if (this.needsUpdate) {
      return this.updateMatrix();
    } else {
      return this;
    }
  }
  updateMatrix() {
    this.needsUpdate = false;

    this.updateLocalMatrix();

    this.getEntity()
      .flatMap(entity => getParentTransform(entity))
      .mapOrElse(
        parentTransform => {
          if (parentTransform instanceof Transform3D) {
            mat4.mul(
              this.matrix,
              parentTransform.getMatrix(),
              this.localMatrix
            );
          } else {
            mat4.mul(
              this.matrix,
              parentTransform.getMatrix4(MAT4_0),
              this.localMatrix
            );
          }
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
import { Transform2D } from "../Transform2D";

export const getParentTransform = (
  entity: Entity
): Option<Transform3D | Transform2D> =>
  entity.getParent().flatMap(getTransform);

const getTransform = (parent: Entity) => {
  const parentTransform3D = parent.getComponent(Transform3D);

  if (parentTransform3D.isSome()) {
    return parentTransform3D;
  } else {
    const parentTransform2D = parent.getComponent(Transform2D);

    if (parentTransform2D.isSome()) {
      return parentTransform2D;
    } else {
      return getParentTransform(parent);
    }
  }
};
