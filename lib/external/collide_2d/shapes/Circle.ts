import { Shape } from "./Shape";

export class Circle extends Shape {
  protected radius: number = 1.0;

  getRadius() {
    return this.radius;
  }
  setRadius(radius: number) {
    this.radius = radius;
    return this;
  }

  update() {
    super.update();

    const aabb = this.getAABB(),
      position = this.getPosition();

    aabb.min[0] = position[0] - this.radius;
    aabb.min[1] = position[1] - this.radius;
    aabb.max[0] = position[0] + this.radius;
    aabb.max[1] = position[1] + this.radius;

    return this;
  }
}
