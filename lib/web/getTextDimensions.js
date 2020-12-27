"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextUnitHeight = exports.getTextHeight = exports.getTextUnitWidth = exports.getTextWidth = exports.INV_BASE_SIZE = exports.BASE_SIZE = void 0;
const getGlobalContext_1 = require("./getGlobalContext");
const getGlobalCanvas_1 = require("./getGlobalCanvas");
exports.BASE_SIZE = 16, exports.INV_BASE_SIZE = 1 / exports.BASE_SIZE;
function getTextWidth(font, fontSize, text) {
    return getTextUnitWidth(font, text) * fontSize;
}
exports.getTextWidth = getTextWidth;
function getTextUnitWidth(font, text) {
    const ctx = getGlobalContext_1.getGlobalContext();
    ctx.save();
    ctx.font = `${exports.BASE_SIZE}px ${font}`;
    const metrics = ctx.measureText(text);
    ctx.restore();
    return metrics.width * exports.INV_BASE_SIZE;
}
exports.getTextUnitWidth = getTextUnitWidth;
const HEIGHT_CACHE = {}, SIZE = 128;
function getTextHeight(font, fontSize) {
    return getTextUnitHeight(font) * fontSize;
}
exports.getTextHeight = getTextHeight;
function getTextUnitHeight(font) {
    let result = HEIGHT_CACHE[font];
    if (!result) {
        const canvas = getGlobalCanvas_1.getGlobalCanvas(), ctx = getGlobalContext_1.getGlobalContext(), size = SIZE, halfSize = size * 0.5;
        canvas.width = size;
        canvas.height = size;
        ctx.save();
        ctx.font = `${exports.BASE_SIZE}px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("fißgPauljMPÜÖÄ", halfSize, halfSize);
        const data = ctx.getImageData(0, 0, size, size).data;
        ctx.restore();
        let firstY = -1;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                const alpha = data[(size * y + x) * 4 + 3];
                if (alpha > 0) {
                    firstY = y;
                    break;
                }
            }
            if (firstY >= 0) {
                break;
            }
        }
        let lastY = -1;
        for (let y = size; y > 0; y--) {
            for (let x = 0; x < size; x++) {
                const alpha = data[(size * y + x) * 4 + 3];
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
