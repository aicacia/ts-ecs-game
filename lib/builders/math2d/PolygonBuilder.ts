import { vec2 } from "gl-matrix";
import { Line, Point, Transform2D } from "../../components";
import { Entity, IBuilder } from "../../sceneGraph";

export class PolygonBuilder implements IBuilder<Entity> {
  entity: Entity = new Entity();

  points: Entity[] = [];
  lines: Entity[] = [];

  build() {
    if (this.points.length > 2) {
      const start = this.points[0],
        end = this.points[this.points.length - 1];

      this.addLine(start, end);
    }

    this.entity.addChildren(this.points);
    this.entity.addChildren(this.lines);

    return this.entity;
  }

  addPoint(position: vec2) {
    const start = this.points[this.points.length - 1],
      end = new Entity()
        .addTag(`point-${this.points.length}`)
        .addComponent(
          new Transform2D().setLocalPosition(position),
          new Point()
        );

    if (start) {
      this.addLine(start, end);
    }

    this.points.push(end);

    return this;
  }

  private addLine(start: Entity, end: Entity) {
    this.lines.push(
      new Entity()
        .addTag(`line-${this.lines.length}`)
        .addComponent(new Line(start, end))
    );
  }
}
