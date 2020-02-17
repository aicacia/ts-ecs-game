import { Option } from "@aicacia/core";
import { mat2d, mat4 } from "gl-matrix";
import { Entity } from "../sceneGraph";
import { RenderableComponent } from "./RenderableComponent";

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
      return this.getParentTransform(entity);
    }
  }
  protected needsUpdate: boolean = true;
  protected localNeedsUpdate: boolean = true;

  onDetach() {
    return this.setNeedsUpdate();
  }

  getParentTransform() {
    return this.getEntity().flatMap(entity =>
      TransformComponent.getParentTransform(entity)
    );
  }

  setNeedsUpdate(needsUpdate: boolean = true) {
    if (needsUpdate !== this.needsUpdate) {
      this.setLocalNeedsUpdate(needsUpdate);
      this.needsUpdate = needsUpdate;
      this.getEntity().map(entity =>
        entity.forEachChild(child =>
          child
            .getComponentsInstanceOf(TransformComponent as any)
            .forEach(transform =>
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

  abstract updateLocalMatrix(): this;
  abstract updateMatrix(): this;
  abstract getMatrix2d(out: mat2d): mat2d;
  abstract getMatrix4(out: mat4): mat4;
}
