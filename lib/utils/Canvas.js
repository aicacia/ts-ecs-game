"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
var tslib_1 = require("tslib");
var events_1 = require("events");
var Canvas = /** @class */ (function (_super) {
    tslib_1.__extends(Canvas, _super);
    function Canvas() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 1;
        _this.height = 1;
        return _this;
    }
    Canvas.prototype.getWidth = function () {
        return this.width;
    };
    Canvas.prototype.getHeight = function () {
        return this.height;
    };
    Canvas.prototype.setWidth = function (width) {
        return this.set(width, this.height);
    };
    Canvas.prototype.setHeight = function (height) {
        return this.set(this.width, height);
    };
    Canvas.prototype.set = function (width, height) {
        var origWidth = this.width, origHeight = this.height;
        if (width !== origWidth || height !== origHeight) {
            this.width = width;
            this.height = height;
            this.onResize();
            this.emit("resize", width, height, origWidth, origHeight);
        }
        return this;
    };
    return Canvas;
}(events_1.EventEmitter));
exports.Canvas = Canvas;
