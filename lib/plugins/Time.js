"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = void 0;
var tslib_1 = require("tslib");
var math_1 = require("../math");
var Plugin_1 = require("@aicacia/ecs/lib/Plugin");
var Time = /** @class */ (function (_super) {
    tslib_1.__extends(Time, _super);
    function Time() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.scale = 1.0;
        _this.fixedDelta = 1.0 / 60.0;
        _this.frame = 0;
        _this.last = -(1.0 / 60.0);
        _this.current = 0.0;
        _this.delta = 1.0 / 60.0;
        _this.fps = 60.0;
        _this.fpsFrame = 0;
        _this.fpsLast = 0;
        _this.startTime = Date.now() * 0.001;
        _this.minDelta = math_1.EPSILON;
        _this.maxDelta = Infinity;
        return _this;
    }
    Time.prototype.getStartTime = function () {
        return this.startTime;
    };
    Time.prototype.getDelta = function () {
        return this.delta * this.scale;
    };
    Time.prototype.getRealDelta = function () {
        return this.delta * this.scale;
    };
    Time.prototype.getCurrent = function () {
        return this.current;
    };
    Time.prototype.getMinDelta = function () {
        return this.minDelta;
    };
    Time.prototype.setMinDelta = function (minDelta) {
        this.minDelta = minDelta;
        return this;
    };
    Time.prototype.getMaxDelta = function () {
        return this.maxDelta;
    };
    Time.prototype.setMaxDelta = function (maxDelta) {
        this.maxDelta = maxDelta;
        return this;
    };
    Time.prototype.getFrame = function () {
        return this.frame;
    };
    Time.prototype.getFps = function () {
        return this.fps;
    };
    Time.prototype.getScale = function () {
        return this.scale;
    };
    Time.prototype.setScale = function (scale) {
        this.scale = scale;
        return this;
    };
    Time.prototype.getFixedDelta = function () {
        return this.fixedDelta * this.scale;
    };
    Time.prototype.setFixedDelta = function (fixedDelta) {
        this.fixedDelta = fixedDelta;
        return this;
    };
    Time.prototype.now = function () {
        return Date.now() * 0.001 - this.startTime;
    };
    Time.prototype.onUpdate = function () {
        ++this.frame;
        this.last = this.current;
        this.current = this.now();
        this.fpsFrame++;
        if (this.fpsLast + 1 < this.current) {
            this.fps = this.fpsFrame / (this.current - this.fpsLast);
            this.fpsLast = this.current;
            this.fpsFrame = 0;
        }
        this.delta = (this.current - this.last) * this.scale;
        this.delta =
            this.delta < this.minDelta
                ? this.minDelta
                : this.delta > this.maxDelta
                    ? this.maxDelta
                    : this.delta;
        return this;
    };
    Time.prototype.toJSON = function () {
        return tslib_1.__assign(tslib_1.__assign({}, _super.prototype.toJSON.call(this)), { frame: this.frame, scale: this.scale, fixedDelta: this.fixedDelta });
    };
    Time.prototype.fromJSON = function (json) {
        _super.prototype.fromJSON.call(this, json);
        this.frame = json.frame;
        this.scale = json.scale;
        this.fixedDelta = json.fixedDelta;
        return this;
    };
    Time.pluginPriority = -Infinity;
    return Time;
}(Plugin_1.Plugin));
exports.Time = Time;
