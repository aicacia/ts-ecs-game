import { IConstructor, Option } from "@aicacia/core";

export class JSONClassRegistry {
  private constructorToTypeId: Map<IConstructor<any>, string> = new Map();
  private typeIdToConstructor: Map<string, IConstructor<any>> = new Map();

  getByConstructor<T>(klass: IConstructor<T>) {
    return Option.from(this.constructorToTypeId.get(klass))
      .map((typeId) => {
        const storedKlass = this.typeIdToConstructor.get(typeId);

        if (klass === storedKlass) {
          return typeId;
        } else {
          throw new Error(
            `${klass} and ${storedKlass} are using the same jsonName/typeId ${typeId}`
          );
        }
      })
      .unwrapOrElse(() => {
        const typeId =
          typeof (klass as any).getJSONName === "function"
            ? (klass as any).getJSONName()
            : klass.name;
        this.constructorToTypeId.set(klass, typeId);
        this.typeIdToConstructor.set(typeId, klass);
        return typeId;
      });
  }
  getById<T>(jsonName: string): Option<IConstructor<T>> {
    return Option.from(this.typeIdToConstructor.get(jsonName));
  }
}

export const globalJSONClassRegistry = new JSONClassRegistry();
