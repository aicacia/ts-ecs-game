"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FullScreenCanvas = void 0;
var tslib_1 = require("tslib");
var RunOnUpdatePlugin_1 = require("./RunOnUpdatePlugin");
var input_1 = require("./input");
var FullScreenCanvas = /** @class */ (function (_super) {
    tslib_1.__extends(FullScreenCanvas, _super);
    function FullScreenCanvas(canvas) {
        var _this = _super.call(this) || this;
        _this.onResize = function () {
            _this.enqueue(_this.runOnResizeFn);
        };
        _this.runOnResizeFn = function () {
            var input = _this.getRequiredPlugin(input_1.Input);
            _this.canvas.set(input.getValue("width"), input.getValue("height"));
        };
        _this.canvas = canvas;
        return _this;
    }
    FullScreenCanvas.prototype.getCanvas = function () {
        return this.canvas;
    };
    FullScreenCanvas.prototype.onAdd = function () {
        this.getRequiredPlugin(input_1.Input).on("resize", this.onResize);
        return this;
    };
    FullScreenCanvas.prototype.onRemove = function () {
        this.getRequiredPlugin(input_1.Input).off("resize", this.onResize);
        return this;
    };
    FullScreenCanvas.requiredPlugins = [input_1.Input];
    return FullScreenCanvas;
}(RunOnUpdatePlugin_1.RunOnUpdatePlugin));
exports.FullScreenCanvas = FullScreenCanvas;
