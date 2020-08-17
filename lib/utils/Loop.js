"use strict";
exports.__esModule = true;
exports.Loop = void 0;
var raf = require("raf");
var Loop = /** @class */ (function () {
    function Loop(handler) {
        var _this = this;
        this.id = null;
        this.running = false;
        this.run = function (ms) {
            _this.handler(ms);
            if (_this.running) {
                _this.request();
            }
            else if (_this.resolve) {
                _this.resolve();
                _this.resolve = undefined;
            }
            return _this;
        };
        this.handler = handler;
    }
    Loop.prototype.getHandler = function () {
        return this.handler;
    };
    Loop.prototype.setHandler = function (handler) {
        this.handler = handler;
        return this;
    };
    Loop.prototype.start = function () {
        var _this = this;
        this.running = true;
        return new Promise(function (resolve) {
            _this.resolve = resolve;
            _this.request();
        });
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
    return Loop;
}());
exports.Loop = Loop;
