import { Either } from "@aicacia/core";
import { IConstructor } from "./IConstructor";

export type IRequirement<T> =
  | IConstructor<T>
  | Either<IConstructor<T>, IConstructor<T>>;

export function getRequirement<T>(
  requirement: IRequirement<T>
): IConstructor<T> {
  if (requirement instanceof Either) {
    if (requirement.isLeft()) {
      return requirement.unwrapLeft();
    } else {
      return requirement.unwrapRight();
    }
  } else {
    return requirement;
  }
}
