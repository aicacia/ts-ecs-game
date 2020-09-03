"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalCanvas = void 0;
var CANVAS = null;
function getGlobalCanvas() {
    if (CANVAS === null) {
        CANVAS = document.createElement("canvas");
    }
    return CANVAS;
}
exports.getGlobalCanvas = getGlobalCanvas;
