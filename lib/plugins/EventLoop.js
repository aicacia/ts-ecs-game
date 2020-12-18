"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventLoop = void 0;
var tslib_1 = require("tslib");
var raf = require("raf");
var Plugin_1 = require("@aicacia/ecs/lib/Plugin");
var EventLoop = /** @class */ (function (_super) {
    tslib_1.__extends(EventLoop, _super);
    function EventLoop(input) {
        var _this = _super.call(this) || this;
        _this.id = null;
        _this.running = false;
        _this.start = function () {
            if (!_this.running) {
                _this.running = true;
                _this.request();
            }
        };
        _this.run = function (_ms) {
            _this.id = null;
            _this.getRequiredScene().update();
            _this.running = false;
            return _this;
        };
        _this.input = input;
        _this.input.on("event", _this.start);
        return _this;
    }
    EventLoop.prototype.getInput = function () {
        return this.input;
    };
    EventLoop.prototype.setInput = function (input) {
        this.input.off("event", this.start);
        this.input = input;
        this.input.on("event", this.start);
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
    EventLoop.prototype.onInit = function () {
        this.start();
        return this;
    };
    return EventLoop;
}(Plugin_1.Plugin));
exports.EventLoop = EventLoop;
