"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunOnUpdatePlugin = void 0;
var tslib_1 = require("tslib");
var Plugin_1 = require("../Plugin");
var RunOnUpdatePlugin = /** @class */ (function (_super) {
    tslib_1.__extends(RunOnUpdatePlugin, _super);
    function RunOnUpdatePlugin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.queue = [];
        _this.swap = [];
        return _this;
    }
    RunOnUpdatePlugin.prototype.enqueue = function () {
        var _a;
        var events = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            events[_i] = arguments[_i];
        }
        (_a = this.queue).push.apply(_a, tslib_1.__spread(events));
        return this;
    };
    RunOnUpdatePlugin.prototype.onUpdate = function () {
        if (this.queue.length > 0) {
            var queue = this.queue;
            this.queue = this.swap;
            this.swap = queue;
            queue.forEach(function (event) { return event(); });
            this.swap.length = 0;
        }
        return this;
    };
    return RunOnUpdatePlugin;
}(Plugin_1.Plugin));
exports.RunOnUpdatePlugin = RunOnUpdatePlugin;
