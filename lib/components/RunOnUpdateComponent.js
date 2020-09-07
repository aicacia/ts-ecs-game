"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunOnUpdateComponent = void 0;
var tslib_1 = require("tslib");
var RenderableComponent_1 = require("./RenderableComponent");
var RunOnUpdateComponent = /** @class */ (function (_super) {
    tslib_1.__extends(RunOnUpdateComponent, _super);
    function RunOnUpdateComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.queue = [];
        _this.swap = [];
        return _this;
    }
    RunOnUpdateComponent.prototype.runOnUpdate = function () {
        var _a;
        var fns = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            fns[_i] = arguments[_i];
        }
        (_a = this.queue).push.apply(_a, tslib_1.__spread(fns));
        return this;
    };
    RunOnUpdateComponent.prototype.onUpdate = function () {
        var _this = this;
        if (this.queue.length > 0) {
            var queue = this.queue;
            this.queue = this.swap;
            this.swap = queue;
            queue.forEach(function (fn) { return fn.call(_this); });
            this.swap.length = 0;
        }
        return this;
    };
    return RunOnUpdateComponent;
}(RenderableComponent_1.RenderableComponent));
exports.RunOnUpdateComponent = RunOnUpdateComponent;
