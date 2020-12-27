"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIText = exports.TextDirection = exports.TextBaseline = exports.TextAlign = void 0;
const UIElement_1 = require("./UIElement");
var TextAlign;
(function (TextAlign) {
    TextAlign["Start"] = "start";
    TextAlign["Left"] = "left";
    TextAlign["Right"] = "right";
    TextAlign["Center"] = "center";
})(TextAlign = exports.TextAlign || (exports.TextAlign = {}));
var TextBaseline;
(function (TextBaseline) {
    TextBaseline["Top"] = "top";
    TextBaseline["Hanging"] = "hanging";
    TextBaseline["Middle"] = "middle";
    TextBaseline["Alphabetic"] = "alphabetic";
    TextBaseline["Ideographic"] = "ideographic";
    TextBaseline["Bottom"] = "bottom";
})(TextBaseline = exports.TextBaseline || (exports.TextBaseline = {}));
var TextDirection;
(function (TextDirection) {
    TextDirection["LeftToRight"] = "ltr";
    TextDirection["RightToLeft"] = "rtl";
    TextDirection["Inherit"] = "inherit";
})(TextDirection = exports.TextDirection || (exports.TextDirection = {}));
class UIText extends UIElement_1.UIElement {
    constructor() {
        super(...arguments);
        this.text = "";
        this.font = "sans-serif";
        this.size = 1;
        this.align = TextAlign.Center;
        this.baseline = TextBaseline.Middle;
        this.direction = TextDirection.Inherit;
    }
    getText() {
        return this.text;
    }
    setText(text) {
        this.text = text;
        return this;
    }
    getAlign() {
        return this.align;
    }
    setAlign(align) {
        this.align = align;
        return this;
    }
    getBaseline() {
        return this.baseline;
    }
    setBaseline(baseline) {
        this.baseline = baseline;
        return this;
    }
    getDirection() {
        return this.direction;
    }
    setDirection(direction) {
        this.direction = direction;
        return this;
    }
    getFont() {
        return this.font;
    }
    setFont(font) {
        this.font = font;
        return this;
    }
    getSize() {
        return this.size;
    }
    setSize(size) {
        this.size = size;
        return this;
    }
}
exports.UIText = UIText;
