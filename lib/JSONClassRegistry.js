"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalJSONClassRegistry = exports.JSONClassRegistry = void 0;
var core_1 = require("@aicacia/core");
var JSONClassRegistry = /** @class */ (function () {
    function JSONClassRegistry() {
        this.constructorToTypeId = new Map();
        this.typeIdToConstructor = new Map();
    }
    JSONClassRegistry.prototype.getByConstructor = function (klass) {
        var _this = this;
        return core_1.Option.from(this.constructorToTypeId.get(klass))
            .map(function (typeId) {
            var storedKlass = _this.typeIdToConstructor.get(typeId);
            if (klass === storedKlass) {
                return typeId;
            }
            else {
                throw new Error(klass + " and " + storedKlass + " are using the same jsonName/typeId " + typeId);
            }
        })
            .unwrapOrElse(function () {
            var typeId = typeof klass.getTypeId === "function"
                ? klass.getTypeId()
                : klass.name;
            _this.constructorToTypeId.set(klass, typeId);
            _this.typeIdToConstructor.set(typeId, klass);
            return typeId;
        });
    };
    JSONClassRegistry.prototype.getById = function (jsonName) {
        return core_1.Option.from(this.typeIdToConstructor.get(jsonName));
    };
    return JSONClassRegistry;
}());
exports.JSONClassRegistry = JSONClassRegistry;
exports.globalJSONClassRegistry = new JSONClassRegistry();