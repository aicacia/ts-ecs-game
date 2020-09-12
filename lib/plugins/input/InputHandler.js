"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputHandler = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var ToFromJSONEventEmitter_1 = require("../../ToFromJSONEventEmitter");
var InputHandler = /** @class */ (function (_super) {
    tslib_1.__extends(InputHandler, _super);
    function InputHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.input = core_1.none();
        return _this;
    }
    InputHandler.prototype.getConstructor = function () {
        return Object.getPrototypeOf(this).constructor;
    };
    InputHandler.prototype.UNSAFE_setInput = function (input) {
        this.input.replace(input);
        return this;
    };
    InputHandler.prototype.UNSAFE_removeInput = function () {
        this.input.clear();
        return this;
    };
    InputHandler.prototype.getInput = function () {
        return this.input;
    };
    InputHandler.prototype.getRequiredInput = function () {
        return this.getInput().expect(this.getConstructor() + " requires a Input Plugin");
    };
    InputHandler.prototype.getScene = function () {
        return this.getInput().flatMap(function (input) { return input.getScene(); });
    };
    InputHandler.prototype.getRequiredScene = function () {
        return this.getScene().expect(this.getConstructor() + " requires a Scene");
    };
    InputHandler.prototype.onAdd = function () {
        return this;
    };
    InputHandler.prototype.onRemove = function () {
        return this;
    };
    InputHandler.prototype.onUpdate = function (_time) {
        return this;
    };
    InputHandler.prototype.onAfterUpdate = function (_time) {
        return this;
    };
    return InputHandler;
}(ToFromJSONEventEmitter_1.ToFromJSONEventEmitter));
exports.InputHandler = InputHandler;
