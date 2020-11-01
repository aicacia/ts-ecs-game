"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventLoop = void 0;
var raf = require("raf");
var EventLoop = /** @class */ (function () {
    function EventLoop(input, handler) {
        var _this = this;
        this.id = null;
        this.running = false;
        this.start = function () {
            if (!_this.running) {
                _this.running = true;
                _this.request();
            }
        };
        this.run = function (ms) {
            _this.id = null;
            _this.handler(ms);
            _this.running = false;
            return _this;
        };
        this.input = input;
        this.input.on("event", this.start);
        this.handler = handler;
    }
    EventLoop.prototype.getInput = function () {
        return this.input;
    };
    EventLoop.prototype.setInput = function (input) {
        if (this.input) {
            this.input.off("event", this.start);
        }
        this.input = input;
        this.input.on("event", this.start);
        return this;
    };
    EventLoop.prototype.getHandler = function () {
        return this.handler;
    };
    EventLoop.prototype.setHandler = function (handler) {
        this.handler = handler;
        return this;
    };
    EventLoop.prototype.stop = function () {
        this.running = false;
        if (this.id !== null) {
            raf.cancel(this.id);
            this.id = null;
        }
        return this;
    };
    EventLoop.prototype.isStopped = function () {
        return this.running === false;
    };
    EventLoop.prototype.request = function () {
        this.id = raf(this.run);
        return this;
    };
    return EventLoop;
}());
exports.EventLoop = EventLoop;
