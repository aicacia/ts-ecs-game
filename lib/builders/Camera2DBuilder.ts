import { Camera2D, Transform2D } from "../components";
import { Entity, IBuilder } from "../sceneGraph";

export class Camera2DBuilder implements IBuilder<Entity> {
  camera2d: Camera2D = new Camera2D();
  transform2d: Transform2D = new Transform2D();
  entity: Entity = new Entity();

  mapCamera2D(fn: (camera2d: Camera2D) => Camera2D) {
    fn(this.camera2d);
    return this;
  }

  mapTransform2D(fn: (transform2d: Transform2D) => Transform2D) {
    fn(this.transform2d);
    return this;
  }

  build() {
    return this.entity.addComponent(this.camera2d, this.transform2d);
  }
}
