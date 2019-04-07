import { Shape } from "./Shape";

export class Circle extends Shape {
  private radius: number = 1.0;

  getRadius() {
    return this.radius;
  }
  setRadius(radius: number) {
    this.radius = radius;
    return this;
  }

  update() {
    super.update();

    this.aabb.min[0] = this.position[0] - this.radius;
    this.aabb.min[1] = this.position[1] - this.radius;
    this.aabb.max[0] = this.position[0] + this.radius;
    this.aabb.max[1] = this.position[1] + this.radius;

    return this;
  }
}
