import { Option } from "@aicacia/core";
import { mat2d, mat4, quat, vec2, vec3 } from "gl-matrix";
import { Entity } from "../sceneGraph";
import { RenderableComponent } from "./RenderableComponent";

const VEC2_0 = vec2.create(),
  VEC3_0 = vec3.create();

export abstract class TransformComponent extends RenderableComponent {
  static getParentTransform(entity: Entity): Option<TransformComponent> {
    return entity.getParent().flatMap(this.getTransform);
  }

  static getTransform(entity: Entity) {
    const entityTransform = entity.getComponentInstanceOf(
      TransformComponent as any
    ) as Option<TransformComponent>;

    if (entityTransform.isSome()) {
      return entityTransform;
    } else {
      return TransformComponent.getParentTransform(entity);
    }
  }

  static getRequiredTransform(entity: Entity) {
    return TransformComponent.getTransform(entity).expect(
      `Entity required a TransformComponent`
    );
  }

  protected needsUpdate: boolean = true;
  protected localNeedsUpdate: boolean = true;

  onDetach() {
    return this.setNeedsUpdate();
  }

  getParentTransform() {
    return this.getEntity().flatMap((entity) =>
      TransformComponent.getParentTransform(entity)
    );
  }

  setNeedsUpdate(needsUpdate: boolean = true) {
    if (needsUpdate !== this.needsUpdate) {
      this.setLocalNeedsUpdate(needsUpdate);
      this.needsUpdate = needsUpdate;
      this.getEntity().map((entity) =>
        entity.forEachChild((child) =>
          child
            .getComponentsInstanceOf(TransformComponent as any)
            .forEach((transform) =>
              (transform as TransformComponent).setNeedsUpdate(needsUpdate)
            )
        )
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

  updateMatrixIfNeeded() {
    if (this.needsUpdate) {
      return this.updateMatrix();
    } else {
      return this;
    }
  }

  translate2(position: vec2): this {
    const current = this.getLocalPosition2(VEC2_0);
    vec2.add(current, current, position);
    return this.setLocalPosition2(current);
  }
  translate3(position: vec3): this {
    const current = this.getLocalPosition3(VEC3_0);
    vec3.add(current, current, position);
    return this.setLocalPosition3(current);
  }

  scale2(scale: vec2): this {
    const current = this.getLocalScale2(VEC2_0);
    vec2.mul(current, current, scale);
    return this.setLocalPosition2(current);
  }
  scale3(scale: vec3): this {
    const current = this.getLocalScale3(VEC3_0);
    vec3.mul(current, current, scale);
    return this.setLocalPosition3(current);
  }

  abstract updateLocalMatrix(): this;
  abstract updateMatrix(): this;
  abstract getMatrix2d(out: mat2d): mat2d;
  abstract getMatrix4(out: mat4): mat4;

  abstract getLocalPosition2(out: vec2): vec2;
  abstract getLocalPosition3(out: vec3): vec3;

  abstract setLocalPosition2(localPosition: vec2): this;
  abstract setLocalPosition3(localPosition: vec3): this;

  abstract getLocalRotationZ(): number;
  abstract getLocalRotationQuat(out: quat): quat;

  abstract setLocalRotationZ(localRotation: number): this;
  abstract setLocalRotationQuat(localRotation: quat): this;

  abstract getLocalScale2(out: vec2): vec2;
  abstract getLocalScale3(out: vec3): vec3;

  abstract setLocalScale2(localScale: vec2): this;
  abstract setLocalScale3(localScale: vec3): this;

  abstract getPosition2(out: vec2): vec2;
  abstract getPosition3(out: vec3): vec3;

  abstract getRotationZ(): number;
  abstract getRotationQuat(out: quat): quat;

  abstract getScale2(out: vec2): vec2;
  abstract getScale3(out: vec3): vec3;
}