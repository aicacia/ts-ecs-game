import { Body } from "../Body";
import { Shape } from "../shapes";

export interface IBroadPhase {
  run(bodies: Body[]): Array<[Shape, Shape]>;
}
