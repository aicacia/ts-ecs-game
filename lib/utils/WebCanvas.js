"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebCanvas = void 0;
var tslib_1 = require("tslib");
var Canvas_1 = require("./Canvas");
var WebCanvas = /** @class */ (function (_super) {
    tslib_1.__extends(WebCanvas, _super);
    function WebCanvas(canvas) {
        var _this = _super.call(this) || this;
        _this.canvas = canvas ? canvas : document.createElement("canvas");
        _this.onResize();
        return _this;
    }
    WebCanvas.prototype.getElement = function () {
        return this.canvas;
    };
    WebCanvas.prototype.onResize = function () {
        this.canvas.width = this.getWidth();
        this.canvas.height = this.getHeight();
        this.canvas.style.width = this.getWidth() + "px";
        this.canvas.style.height = this.getHeight() + "px";
        return this;
    };
    WebCanvas.prototype.getImageURI = function () {
        return this.canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");
    };
    WebCanvas.prototype.getStream = function (fps) {
        if (fps === void 0) { fps = 60; }
        return this.canvas.captureStream(fps);
    };
    return WebCanvas;
}(Canvas_1.Canvas));
exports.WebCanvas = WebCanvas;
