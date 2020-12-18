"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalCanvas = void 0;
var core_1 = require("@aicacia/core");
var CANVAS = core_1.none();
function getGlobalCanvas() {
    if (CANVAS.isSome()) {
        return CANVAS.unwrap();
    }
    else {
        var canvas = document.createElement("canvas");
        CANVAS.replace(canvas);
        return canvas;
    }
}
exports.getGlobalCanvas = getGlobalCanvas;
