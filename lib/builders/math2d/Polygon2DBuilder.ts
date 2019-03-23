import { vec2 } from "gl-matrix";
import { Angle, Line, Point, Transform2D } from "../../components";
import { Entity, IBuilder } from "../../sceneGraph";

export class Polygon2DBuilder implements IBuilder<Entity> {
  entity: Entity = new Entity();

  points: Entity[] = [];
  lines: Entity[] = [];
  angles: Entity[] = [];
  closed: boolean = false;

  build() {
    if (this.closed && this.points.length > 2) {
      const start = this.points[0],
        end = this.points[this.points.length - 1];

      this.addLine(start, end);
    }

    this.entity.addChildren(this.points);
    this.entity.addChildren(this.lines);
    this.entity.addChildren(this.angles);

    return this.entity;
  }

  setClosed(closed: boolean) {
    this.closed = closed;
    return this;
  }

  addPoint(position: vec2, fn?: (point: Point) => Point) {
    const start = this.points[this.points.length - 1],
      end = new Entity()
        .addTag(`point-${this.points.length}`)
        .addComponent(
          new Transform2D().setLocalPosition(position),
          fn ? fn(new Point()) : new Point()
        );

    if (start) {
      this.addLine(start, end);
    }

    this.points.push(end);

    return this;
  }

  private addLine(start: Entity, end: Entity) {
    const lastLine = this.lines[this.lines.length - 1],
      line = new Entity()
        .addTag(`line-${this.lines.length}`)
        .addComponent(new Line(start, end));

    this.lines.push(line);

    if (lastLine) {
      this.addAngle(lastLine, line);
    }
  }

  private addAngle(a: Entity, b: Entity) {
    this.angles.push(
      new Entity()
        .addTag(`angle-${this.angles.length}`)
        .addComponent(new Transform2D(), new Angle(a, b))
    );
  }
}
