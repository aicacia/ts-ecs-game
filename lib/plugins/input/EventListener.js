"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventListener = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var events_1 = require("events");
var EventListener = /** @class */ (function (_super) {
    tslib_1.__extends(EventListener, _super);
    function EventListener() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.input = core_1.none();
        return _this;
    }
    EventListener.prototype.getConstructor = function () {
        return Object.getPrototypeOf(this).constructor;
    };
    EventListener.prototype.UNSAFE_setInput = function (input) {
        this.input = core_1.some(input);
        return this;
    };
    EventListener.prototype.UNSAFE_removeInput = function () {
        this.input = core_1.none();
        return this;
    };
    EventListener.prototype.getInput = function () {
        return this.input;
    };
    EventListener.prototype.getRequiredInput = function () {
        return this.getInput().expect(this.getConstructor() + " requires a Input Plugin");
    };
    EventListener.prototype.getScene = function () {
        return this.getInput().flatMap(function (input) { return input.getScene(); });
    };
    EventListener.prototype.getRequiredScene = function () {
        return this.getScene().expect(this.getConstructor() + " requires a Scene");
    };
    EventListener.prototype.queueEvent = function (event) {
        return this.getInput().map(function (input) { return input.queueEvent(event); });
    };
    EventListener.prototype.onAdd = function () {
        return this;
    };
    EventListener.prototype.onRemove = function () {
        return this;
    };
    EventListener.prototype.onUpdate = function (_time) {
        return this;
    };
    return EventListener;
}(events_1.EventEmitter));
exports.EventListener = EventListener;