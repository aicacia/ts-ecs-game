"use strict";
exports.__esModule = true;
exports.Canvas = void 0;
var tslib_1 = require("tslib");
var events_1 = require("events");
var Canvas = /** @class */ (function (_super) {
    tslib_1.__extends(Canvas, _super);
    function Canvas(canvas, options) {
        if (options === void 0) { options = {}; }
        var _this = _super.call(this) || this;
        _this.width = 1;
        _this.height = 1;
        _this.canvas = canvas ? canvas : document.createElement("canvas");
        _this.canvas.width = _this.width;
        _this.canvas.height = _this.height;
        if (options.disableContextMenu === true) {
            _this.canvas.oncontextmenu = function () { return false; };
        }
        return _this;
    }
    Canvas.prototype.getElement = function () {
        return this.canvas;
    };
    Canvas.prototype.getWidth = function () {
        return this.width;
    };
    Canvas.prototype.getHeight = function () {
        return this.height;
    };
    Canvas.prototype.set = function (width, height) {
        var origWidth = this.width, origHeight = this.height;
        if (width !== origWidth || height !== origHeight) {
            this.width = width;
            this.height = height;
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.canvas.style.width = this.width + "px";
            this.canvas.style.height = this.height + "px";
            this.emit("resize", width, height, origWidth, origHeight);
        }
        return this;
    };
    Canvas.prototype.getImageURI = function () {
        return this.canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
    };
    Canvas.prototype.getStream = function (fps) {
        if (fps === void 0) { fps = 60; }
        return this.canvas.captureStream(fps);
    };
    return Canvas;
}(events_1.EventEmitter));
exports.Canvas = Canvas;
