import { IConstructor } from "@aicacia/core";

export type IRequirement<T> = IConstructor<T> | Array<IConstructor<T>>;

export function filterRequirements<T>(
  missing: IRequirement<T>[],
  requirements: IRequirement<T>[],
  filter: (value: IConstructor<T>) => boolean
) {
  requirements.forEach((requirement) => {
    if (Array.isArray(requirement)) {
      if (!requirement.some(filter)) {
        missing.push(requirement);
      }
    } else {
      if (filter(requirement)) {
        missing.push(requirement);
      }
    }
  });
}

export function requirementToString<T>(requirement: IRequirement<T>): string {
  if (Array.isArray(requirement)) {
    return `one of ${requirement.join(", ")}`;
  } else {
    return requirement.toString();
  }
}
