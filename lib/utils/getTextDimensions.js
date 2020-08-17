"use strict";
exports.__esModule = true;
exports.getTextUnitHeight = exports.getTextHeight = exports.getTextUnitWidth = exports.getTextWidth = exports.INV_BASE_SIZE = exports.BASE_SIZE = void 0;
var getGlobalContext_1 = require("./getGlobalContext");
var getGlobalCanvas_1 = require("./getGlobalCanvas");
exports.BASE_SIZE = 16, exports.INV_BASE_SIZE = 1 / exports.BASE_SIZE;
function getTextWidth(font, fontSize, text) {
    return getTextUnitWidth(font, text) * fontSize;
}
exports.getTextWidth = getTextWidth;
function getTextUnitWidth(font, text) {
    var ctx = getGlobalContext_1.getGlobalContext();
    ctx.save();
    ctx.font = exports.BASE_SIZE + "px " + font;
    var metrics = ctx.measureText(text);
    ctx.restore();
    return metrics.width * exports.INV_BASE_SIZE;
}
exports.getTextUnitWidth = getTextUnitWidth;
var HEIGHT_CACHE = {}, SIZE = 128;
function getTextHeight(font, fontSize) {
    return getTextUnitHeight(font) * fontSize;
}
exports.getTextHeight = getTextHeight;
function getTextUnitHeight(font) {
    var result = HEIGHT_CACHE[font];
    if (!result) {
        var canvas = getGlobalCanvas_1.getGlobalCanvas(), ctx = getGlobalContext_1.getGlobalContext(), size = SIZE, halfSize = size * 0.5;
        canvas.width = size;
        canvas.height = size;
        ctx.save();
        ctx.font = exports.BASE_SIZE + "px " + font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("fißgPauljMPÜÖÄ", halfSize, halfSize);
        var data = ctx.getImageData(0, 0, size, size).data;
        ctx.restore();
        var firstY = -1;
        for (var y = 0; y < size; y++) {
            for (var x = 0; x < size; x++) {
                var alpha = data[(size * y + x) * 4 + 3];
                if (alpha > 0) {
                    firstY = y;
                    break;
                }
            }
            if (firstY >= 0) {
                break;
            }
        }
        var lastY = -1;
        for (var y = size; y > 0; y--) {
            for (var x = 0; x < size; x++) {
                var alpha = data[(size * y + x) * 4 + 3];
                if (alpha > 0) {
                    lastY = y;
                    break;
                }
            }
            if (lastY >= 0) {
                break;
            }
        }
        result = (lastY - firstY) * exports.INV_BASE_SIZE;
        HEIGHT_CACHE[font] = result;
    }
    return result;
}
exports.getTextUnitHeight = getTextUnitHeight;
