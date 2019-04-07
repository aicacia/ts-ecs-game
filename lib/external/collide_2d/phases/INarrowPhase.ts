import { Shape } from "../shapes";
import { Contact } from "./Contact";

export interface INarrowPhase {
  run(pairs: Array<[Shape, Shape]>): Contact[];
}
