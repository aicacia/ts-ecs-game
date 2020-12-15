"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputAxis = void 0;
var math_1 = require("../../math");
var InputAxis = /** @class */ (function () {
    function InputAxis(name, negButton, posButton) {
        this.gravity = 3;
        this.sensitivity = 3;
        this.dead = 0.001;
        this.value = 0.0;
        this.name = name;
        this.negButton = negButton;
        this.posButton = posButton;
    }
    InputAxis.prototype.getName = function () {
        return this.name;
    };
    InputAxis.prototype.getNegButton = function () {
        return this.negButton;
    };
    InputAxis.prototype.setNegButton = function (negButton) {
        this.negButton = negButton;
        return this;
    };
    InputAxis.prototype.getPosButton = function () {
        return this.posButton;
    };
    InputAxis.prototype.setPosButton = function (posButton) {
        this.posButton = posButton;
        return this;
    };
    InputAxis.prototype.getGravity = function () {
        return this.gravity;
    };
    InputAxis.prototype.setGravity = function (gravity) {
        this.gravity = gravity;
        return this;
    };
    InputAxis.prototype.getSensitivity = function () {
        return this.sensitivity;
    };
    InputAxis.prototype.setSensitivity = function (sensitivity) {
        this.sensitivity = sensitivity;
        return this;
    };
    InputAxis.prototype.getDead = function () {
        return this.dead;
    };
    InputAxis.prototype.setDead = function (dead) {
        this.dead = dead;
        return this;
    };
    InputAxis.prototype.getValue = function () {
        return this.value;
    };
    /**
     * @ignore
     */
    InputAxis.prototype.UNSAFE_setValue = function (value) {
        this.value = value;
        return this;
    };
    /**
     * @ignore
     */
    InputAxis.prototype.UNSAFE_update = function (time, value, isNeg, isPos) {
        var delta = time.getDelta();
        if (isNeg) {
            value -= this.getSensitivity() * delta;
        }
        if (isPos) {
            value += this.getSensitivity() * delta;
        }
        if (!isPos && !isNeg && value !== 0.0) {
            value -= math_1.sign(value) * this.getGravity() * delta;
        }
        value = math_1.clamp(value, -1.0, 1.0);
        if (Math.abs(value) <= this.getDead()) {
            value = 0.0;
        }
        this.value = value;
    };
    InputAxis.prototype.toJSON = function () {
        return {
            name: this.name,
            negButton: this.negButton,
            posButton: this.posButton,
            gravity: this.gravity,
            sensitivity: this.sensitivity,
            dead: this.dead,
            value: this.value,
        };
    };
    InputAxis.prototype.fromJSON = function (json) {
        this.name = json.name;
        this.negButton = json.negButton;
        this.posButton = json.posButton;
        this.gravity = json.gravity;
        this.sensitivity = json.sensitivity;
        this.dead = json.dead;
        this.value = json.value;
        return this;
    };
    return InputAxis;
}());
exports.InputAxis = InputAxis;
