"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputButton = void 0;
var InputButton = /** @class */ (function () {
    function InputButton(name) {
        this.value = 0.0;
        this.frameDown = 0;
        this.frameUp = 0;
        this.name = name;
    }
    InputButton.prototype.getName = function () {
        return this.name;
    };
    InputButton.prototype.getFrameDown = function () {
        return this.frameDown;
    };
    InputButton.prototype.getFrameUp = function () {
        return this.frameUp;
    };
    InputButton.prototype.getValue = function () {
        return this.value;
    };
    InputButton.prototype.UNSAFE_setValue = function (value) {
        this.value = value;
        return this;
    };
    InputButton.prototype.UNSAFE_up = function (frame) {
        if (this.value === 1.0) {
            this.frameUp = frame;
        }
        this.value = 0.0;
        return this;
    };
    InputButton.prototype.UNSAFE_down = function (frame) {
        if (this.value === 0.0) {
            this.frameDown = frame;
        }
        this.value = 1.0;
        return this;
    };
    InputButton.prototype.toJSON = function () {
        return {
            name: this.name,
            value: this.value,
            frameDown: this.frameDown,
            frameUp: this.frameUp,
        };
    };
    InputButton.prototype.fromJSON = function (json) {
        this.name = json.name;
        this.value = json.value;
        this.frameDown = json.frameDown;
        this.frameUp = json.frameUp;
        return this;
    };
    return InputButton;
}());
exports.InputButton = InputButton;
