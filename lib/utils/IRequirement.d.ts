import { IConstructor } from "@aicacia/core";
export declare type IRequirement<T> = IConstructor<T> | Array<IConstructor<T>>;
export declare function filterRequirements<T>(missing: IRequirement<T>[], requirements: IRequirement<T>[], filter: (value: IConstructor<T>) => boolean): void;
export declare function requirementToString<T>(requirement: IRequirement<T>): string;
