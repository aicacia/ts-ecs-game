"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIText = exports.TextDirection = exports.TextBaseline = exports.TextAlign = void 0;
var tslib_1 = require("tslib");
var UIElement_1 = require("./UIElement");
var getTextDimensions_1 = require("../../web/getTextDimensions");
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
var UIText = /** @class */ (function (_super) {
    tslib_1.__extends(UIText, _super);
    function UIText() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.text = "";
        _this.font = "sans-serif";
        _this.size = 1;
        _this.align = TextAlign.Center;
        _this.baseline = TextBaseline.Middle;
        _this.direction = TextDirection.Inherit;
        return _this;
    }
    UIText.prototype.getText = function () {
        return this.text;
    };
    UIText.prototype.setText = function (text) {
        this.text = text;
        return this.forceResize();
    };
    UIText.prototype.getAlign = function () {
        return this.align;
    };
    UIText.prototype.setAlign = function (align) {
        this.align = align;
        return this;
    };
    UIText.prototype.getBaseline = function () {
        return this.baseline;
    };
    UIText.prototype.setBaseline = function (baseline) {
        this.baseline = baseline;
        return this;
    };
    UIText.prototype.getDirection = function () {
        return this.direction;
    };
    UIText.prototype.setDirection = function (direction) {
        this.direction = direction;
        return this;
    };
    UIText.prototype.getFont = function () {
        return this.font;
    };
    UIText.prototype.setFont = function (font) {
        this.font = font;
        return this.forceResize();
    };
    UIText.prototype.getSize = function () {
        return this.size;
    };
    UIText.prototype.setSize = function (size) {
        this.size = size;
        return this.forceResize();
    };
    UIText.prototype.forceResize = function () {
        this.width = getTextDimensions_1.getTextWidth(this.font, this.size, this.text);
        this.height = getTextDimensions_1.getTextHeight(this.font, this.size);
        return this;
    };
    return UIText;
}(UIElement_1.UIElement));
exports.UIText = UIText;
