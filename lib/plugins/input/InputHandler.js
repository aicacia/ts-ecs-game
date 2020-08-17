"use strict";
exports.__esModule = true;
exports.InputHandler = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var events_1 = require("events");
var InputHandler = /** @class */ (function (_super) {
    tslib_1.__extends(InputHandler, _super);
    function InputHandler() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.input = core_1.none();
        _this.events = [];
        _this.queueEvent = function (event) {
            _this.events.push(event);
            return _this;
        };
        return _this;
    }
    InputHandler.prototype.getConstructor = function () {
        return Object.getPrototypeOf(this).constructor;
    };
    InputHandler.prototype.UNSAFE_setInput = function (input) {
        this.input = core_1.some(input);
        return this;
    };
    InputHandler.prototype.UNSAFE_removeInput = function () {
        this.input = core_1.none();
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
    InputHandler.prototype.getElement = function () {
        return this.getInput()
            .map(function (input) { return input.getElement(); })
            .expect(this.getConstructor() + " requires an Element");
    };
    InputHandler.prototype.getEvents = function () {
        return this.events;
    };
    InputHandler.prototype.onAdd = function () {
        return this;
    };
    InputHandler.prototype.onRemove = function () {
        return this;
    };
    InputHandler.prototype.onUpdate = function (time) {
        var _this = this;
        this.events.forEach(function (event) { return _this.onEvent(time, event); });
        this.events.length = 0;
        return this;
    };
    InputHandler.prototype.onAfterUpdate = function (_time) {
        return this;
    };
    InputHandler.prototype.onEvent = function (_time, _event) {
        return this;
    };
    return InputHandler;
}(events_1.EventEmitter));
exports.InputHandler = InputHandler;
