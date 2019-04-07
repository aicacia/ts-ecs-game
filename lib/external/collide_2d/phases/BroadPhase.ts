import { AABB2 } from "../../AABB2";
import { Body } from "../Body";
import { Shape } from "../shapes";
import { IBroadPhase } from "./IBroadPhase";

export class BroadPhase implements IBroadPhase {
  private pairs: Array<[Shape, Shape]> = [];

  run(bodies: Body[]): Array<[Shape, Shape]> {
    const count = bodies.length;

    this.pairs.length = 0;

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < count && j !== i; j++) {
        const bi = bodies[i],
          bj = bodies[j];

        if (AABB2.intersects(bi.getAABB(), bj.getAABB())) {
          const shapesi = bi.getShapes(),
            shapesj = bj.getShapes(),
            counti = shapesi.length,
            countj = shapesj.length;

          for (let k = 0; k < counti; k++) {
            for (let l = 0; l < countj; l++) {
              const si = shapesi[k],
                sj = shapesj[l];

              if (AABB2.intersects(si.getAABB(), sj.getAABB())) {
                this.pairs.push([si, sj]);
              }
            }
          }
        }
      }
    }

    return this.pairs;
  }
}
