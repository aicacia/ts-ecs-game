import { IConstructor, Option } from "@aicacia/core";
export declare class JSONClassRegistry {
    private constructorToTypeId;
    private typeIdToConstructor;
    getByConstructor<T>(klass: IConstructor<T>): string;
    getById<T>(jsonName: string): Option<IConstructor<T>>;
}
export declare const globalJSONClassRegistry: JSONClassRegistry;
