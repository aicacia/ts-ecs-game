"use strict";
exports.__esModule = true;
exports.FullScreenCanvas = void 0;
var tslib_1 = require("tslib");
var sceneGraph_1 = require("../sceneGraph");
var FullScreenCanvas = /** @class */ (function (_super) {
    tslib_1.__extends(FullScreenCanvas, _super);
    function FullScreenCanvas(canvas) {
        var _this = _super.call(this) || this;
        _this.onResize = function () {
            var width = _this.window.innerWidth, height = _this.window.innerHeight;
            _this.canvas.set(width, height);
            _this.emit("resize");
        };
        _this.canvas = canvas;
        var document = _this.canvas.getElement().ownerDocument, window = document === null || document === void 0 ? void 0 : document.defaultView;
        if (window) {
            _this.window = window;
        }
        else {
            throw new Error("failed to get window object from canvas element");
        }
        return _this;
    }
    FullScreenCanvas.prototype.getCanvas = function () {
        return this.canvas;
    };
    FullScreenCanvas.prototype.onAdd = function () {
        var style = this.canvas.getElement().style;
        style.position = "absolute";
        style.top = "0px";
        style.left = "0px";
        this.window.addEventListener("orientationchange", this.onResize);
        this.window.addEventListener("resize", this.onResize);
        this.onResize();
        return this;
    };
    FullScreenCanvas.prototype.onRemove = function () {
        this.window.removeEventListener("orientationchange", this.onResize);
        this.window.removeEventListener("resize", this.onResize);
        return this;
    };
    return FullScreenCanvas;
}(sceneGraph_1.Plugin));
exports.FullScreenCanvas = FullScreenCanvas;
