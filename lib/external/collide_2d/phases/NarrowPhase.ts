import { vec2 } from "gl-matrix";
import { Circle, Shape } from "../shapes";
import { Contact } from "./Contact";
import { INarrowPhase } from "./INarrowPhase";

type IShapeConstructor = new (...args: any[]) => Shape;

type IHandler = (si: Shape, sj: Shape, contacts: Contact[]) => void;

export class NarrowPhase implements INarrowPhase {
  private contacts: Contact[] = [];
  private handlers: Map<
    [IShapeConstructor, IShapeConstructor],
    IHandler
  > = new Map();

  constructor() {
    this.handlers.set([Circle, Circle], circleToCircleHandler as any);
  }

  run(pairs: Array<[Shape, Shape]>): Contact[] {
    this.contacts.length = 0;

    for (let i = 0, il = pairs.length; i < il; i++) {
      const pair = pairs[i],
        si = pair[0],
        sj = pair[1],
        handler = this.getHandler(si, sj);

      if (handler) {
        handler(si, sj, this.contacts);
      } else {
        throw new Error(`No Handler for Shapes [${sj}, ${si}]`);
      }
    }

    return this.contacts;
  }

  getHandler(si: Shape, sj: Shape) {
    return this.handlers.get([
      Object.getPrototypeOf(si).constructor,
      Object.getPrototypeOf(sj).constructor
    ]);
  }
}

const VEC2_0 = vec2.create(),
  VEC2_1 = vec2.create(),
  VEC2_2 = vec2.create(),
  VEC2_3 = vec2.create();

export const circleToCircleHandler = (
  si: Circle,
  sj: Circle,
  contacts: Contact[]
) => {
  const xi = si.getPosition(),
    xj = sj.getPosition(),
    d = vec2.sub(VEC2_0, xi, xj),
    r = si.getRadius() + sj.getRadius(),
    rsq = r * r,
    dsq = vec2.dot(d, d);

  if (dsq < rsq) {
    const depth = Math.sqrt(rsq) - Math.sqrt(dsq),
      normal = vec2.normalize(VEC2_1, d),
      position = vec2.add(
        VEC2_2,
        xi,
        vec2.scale(VEC2_3, normal, si.getRadius())
      );

    contacts.push(new Contact(si, sj, position, normal, depth));
  }
};
