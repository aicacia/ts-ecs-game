"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.DEFAULT_DECONSTRUCTOR = void 0;
var tslib_1 = require("tslib");
function DEFAULT_DECONSTRUCTOR(object) {
    for (var key in object) {
        if (object.hasOwnProperty(key)) {
            object[key] = null;
        }
    }
}
exports.DEFAULT_DECONSTRUCTOR = DEFAULT_DECONSTRUCTOR;
var Pool = /** @class */ (function () {
    function Pool(Constructor, Deconstructor, limit) {
        if (Deconstructor === void 0) { Deconstructor = DEFAULT_DECONSTRUCTOR; }
        if (limit === void 0) { limit = Infinity; }
        this.pool = [];
        this.Constructor = Constructor;
        this.Deconstructor = Deconstructor;
        this.limit = limit;
    }
    Pool.prototype.getLimit = function () {
        return this.limit;
    };
    Pool.prototype.setLimit = function (limit) {
        if (limit === void 0) { limit = Infinity; }
        this.limit = limit;
        return this.cleanUpPool();
    };
    Pool.prototype.create = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var object = this.pool.pop();
        if (object) {
            this.Constructor.apply(object, args);
            return object;
        }
        else {
            return new ((_a = this.Constructor).bind.apply(_a, tslib_1.__spread([void 0], args)))();
        }
    };
    Pool.prototype.release = function (object) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.cleanUpPool();
        this.Deconstructor.apply(this, tslib_1.__spread([object], args));
        return this.pool.push(object);
    };
    Pool.prototype.clear = function () {
        this.pool.length = 0;
        return this;
    };
    Pool.prototype.cleanUpPool = function () {
        if (this.limit < this.pool.length) {
            this.pool.length = this.limit;
        }
        return this;
    };
    return Pool;
}());
exports.Pool = Pool;
