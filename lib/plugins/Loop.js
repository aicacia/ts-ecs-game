"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loop = void 0;
var tslib_1 = require("tslib");
var raf = require("raf");
var Plugin_1 = require("@aicacia/ecs/lib/Plugin");
var Loop = /** @class */ (function (_super) {
    tslib_1.__extends(Loop, _super);
    function Loop() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = null;
        _this.running = false;
        _this.resolves = [];
        _this.run = function (_ms) {
            var e_1, _a;
            _this.getRequiredScene().update();
            if (_this.running) {
                _this.request();
            }
            else if (_this.resolves.length) {
                var resolves = _this.resolves;
                _this.resolves = [];
                try {
                    for (var resolves_1 = tslib_1.__values(resolves), resolves_1_1 = resolves_1.next(); !resolves_1_1.done; resolves_1_1 = resolves_1.next()) {
                        var resolve = resolves_1_1.value;
                        resolve();
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (resolves_1_1 && !resolves_1_1.done && (_a = resolves_1.return)) _a.call(resolves_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return _this;
        };
        return _this;
    }
    Loop.prototype.promise = function () {
        var _this = this;
        if (this.running) {
            return new Promise(function (resolve) { return _this.resolves.push(resolve); });
        }
        else {
            return Promise.resolve();
        }
    };
    Loop.prototype.start = function () {
        if (!this.running) {
            this.running = true;
            this.request();
        }
    };
    Loop.prototype.stop = function () {
        this.running = false;
        if (this.id !== null) {
            raf.cancel(this.id);
            this.id = null;
        }
        return this;
    };
    Loop.prototype.isStopped = function () {
        return this.running === false;
    };
    Loop.prototype.request = function () {
        this.id = raf(this.run);
        return this;
    };
    Loop.prototype.onInit = function () {
        this.start();
        return this;
    };
    return Loop;
}(Plugin_1.Plugin));
exports.Loop = Loop;
