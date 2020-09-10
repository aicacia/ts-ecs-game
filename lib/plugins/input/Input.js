"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var Plugin_1 = require("../../Plugin");
var Time_1 = require("../Time");
var InputAxis_1 = require("./InputAxis");
var InputButton_1 = require("./InputButton");
var MouseInputHandler_1 = require("./MouseInputHandler");
var KeyboardInputHandler_1 = require("./KeyboardInputHandler");
var TouchInputHandler_1 = require("./TouchInputHandler");
var ResizeInputHandler_1 = require("./ResizeInputHandler");
var Input = /** @class */ (function (_super) {
    tslib_1.__extends(Input, _super);
    function Input() {
        var _this = _super.call(this) || this;
        _this.events = [];
        _this.inputHandlers = [];
        _this.inputHandlerMap = new Map();
        _this.eventListeners = [];
        _this.eventListenerMap = new Map();
        _this.buttons = {};
        _this.axes = {};
        _this.addInputHandler(new MouseInputHandler_1.MouseInputHandler(), new KeyboardInputHandler_1.KeyboardInputHandler(), new TouchInputHandler_1.TouchInputHandler(), new ResizeInputHandler_1.ResizeInputHandler());
        _this.addAxes(new InputAxis_1.InputAxis("horizontal-keys", "ArrowLeft", "ArrowRight"), new InputAxis_1.InputAxis("vertical-keys", "ArrowDown", "ArrowUp"));
        return _this;
    }
    Input.prototype.queueEvent = function (event) {
        this.events.push(event);
        return this;
    };
    Input.prototype.addAxes = function () {
        var _this = this;
        var axes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            axes[_i] = arguments[_i];
        }
        axes.forEach(function (axis) { return _this._addAxis(axis); });
        return this;
    };
    Input.prototype.addAxis = function () {
        var axes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            axes[_i] = arguments[_i];
        }
        return this.addAxes.apply(this, tslib_1.__spread(axes));
    };
    Input.prototype.getAxis = function (name) {
        return core_1.Option.from(this.axes[name]);
    };
    Input.prototype.getAxisValue = function (name) {
        return this.getAxis(name)
            .map(function (axis) { return axis.getValue(); })
            .unwrapOr(0.0);
    };
    Input.prototype.getRequiredAxis = function (name) {
        return this.getAxis(name).expect("Failed to get Required Axis " + name);
    };
    Input.prototype.getInputHandler = function (InputHandler) {
        return core_1.Option.from(this.inputHandlerMap.get(InputHandler));
    };
    Input.prototype.getRequiredInputHandler = function (InputHandler) {
        return this.getInputHandler(InputHandler).expect("Failed to get Required InputHandler " + InputHandler);
    };
    Input.prototype.getEventListener = function (EventListener) {
        return core_1.Option.from(this.eventListenerMap.get(EventListener));
    };
    Input.prototype.getRequiredEventListener = function (EventListener) {
        return this.getEventListener(EventListener).expect("Failed to get Required EventListener " + EventListener);
    };
    Input.prototype.removeAxes = function () {
        var _this = this;
        var axes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            axes[_i] = arguments[_i];
        }
        axes.forEach(function (axis) { return _this._removeAxis(axis); });
        return this;
    };
    Input.prototype.removeAxis = function () {
        var axes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            axes[_i] = arguments[_i];
        }
        return this.removeAxes.apply(this, tslib_1.__spread(axes));
    };
    Input.prototype.addInputHandlers = function () {
        var _this = this;
        var inputHandlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputHandlers[_i] = arguments[_i];
        }
        inputHandlers.forEach(function (inputHandler) {
            return _this._addInputHandler(inputHandler);
        });
        return this;
    };
    Input.prototype.addInputHandler = function () {
        var inputHandlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputHandlers[_i] = arguments[_i];
        }
        return this.addInputHandlers.apply(this, tslib_1.__spread(inputHandlers));
    };
    Input.prototype.removeInputHandlers = function () {
        var _this = this;
        var inputHandlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputHandlers[_i] = arguments[_i];
        }
        inputHandlers.forEach(function (inputHandler) {
            return _this._removeInputHandler(inputHandler);
        });
        return this;
    };
    Input.prototype.removeInputHandler = function () {
        var inputHandlers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            inputHandlers[_i] = arguments[_i];
        }
        return this.removeInputHandlers.apply(this, tslib_1.__spread(inputHandlers));
    };
    Input.prototype.addEventListeners = function () {
        var _this = this;
        var eventListeners = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            eventListeners[_i] = arguments[_i];
        }
        eventListeners.forEach(function (eventListener) {
            return _this._addEventListener(eventListener);
        });
        return this;
    };
    Input.prototype.addEventListener = function () {
        var eventListeners = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            eventListeners[_i] = arguments[_i];
        }
        return this.addEventListeners.apply(this, tslib_1.__spread(eventListeners));
    };
    Input.prototype.removeEventListeners = function () {
        var _this = this;
        var eventListeners = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            eventListeners[_i] = arguments[_i];
        }
        eventListeners.forEach(function (eventListener) {
            return _this._removeEventListener(eventListener);
        });
        return this;
    };
    Input.prototype.removeEventListener = function () {
        var eventListeners = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            eventListeners[_i] = arguments[_i];
        }
        return this.removeEventListeners.apply(this, tslib_1.__spread(eventListeners));
    };
    Input.prototype.getOrCreateButton = function (name) {
        var button = this.buttons[name];
        if (button) {
            return button;
        }
        else {
            var newButton = new InputButton_1.InputButton(name);
            this.buttons[name] = newButton;
            return newButton;
        }
    };
    Input.prototype.getButton = function (name) {
        return core_1.Option.from(this.buttons[name]);
    };
    Input.prototype.getButtonValue = function (name) {
        return this.getButton(name)
            .map(function (button) { return button.getValue(); })
            .unwrapOr(0.0);
    };
    Input.prototype.isDownCurrentFrame = function (name) {
        var _this = this;
        return this.getButton(name)
            .map(function (button) {
            return button.getFrameDown() === _this.getRequiredPlugin(Time_1.Time).getFrame();
        })
            .unwrapOr(false);
    };
    Input.prototype.isDown = function (name) {
        return !this.isUp(name);
    };
    Input.prototype.isUpCurrentFrame = function (name) {
        var _this = this;
        return this.getButton(name)
            .map(function (button) {
            return button.getFrameUp() === _this.getRequiredPlugin(Time_1.Time).getFrame();
        })
            .unwrapOr(false);
    };
    Input.prototype.isUp = function (name) {
        return this.getButtonValue(name) == 0.0;
    };
    Input.prototype.onUpdate = function () {
        var _this = this;
        var time = this.getRequiredPlugin(Time_1.Time);
        this.eventListeners.forEach(function (eventListener) {
            return eventListener.onUpdate(time);
        });
        this.inputHandlers.forEach(function (inputHandler) {
            _this.events.forEach(function (event) { return inputHandler.onEvent(time, event); });
            inputHandler.onUpdate(time);
        });
        this.events.forEach(function (event) { return _this.emit(event.type, event); });
        this.eventListeners.forEach(function (eventListener) {
            for (var i = 0; i < _this.events.length; i++) {
                var event_1 = _this.events[i];
                if (eventListener.dequeueEvent(event_1)) {
                    _this.events.splice(i, 1);
                    i--;
                }
            }
        });
        this.events.length = 0;
        this.updateAxes(time);
        return this;
    };
    Input.prototype.onAfterUpdate = function () {
        var time = this.getRequiredPlugin(Time_1.Time);
        this.inputHandlers.forEach(function (inputHandler) {
            return inputHandler.onAfterUpdate(time);
        });
        return this;
    };
    Input.prototype._addAxis = function (axis) {
        if (!this.axes[axis.getName()]) {
            this.axes[axis.getName()] = axis;
        }
        return this;
    };
    Input.prototype._removeAxis = function (axis) {
        if (this.axes[axis.getName()]) {
            delete this.axes[axis.getName()];
        }
        return this;
    };
    Input.prototype.updateAxes = function (time) {
        var _this = this;
        Object.keys(this.axes).forEach(function (key) {
            return _this.updateAxis(_this.axes[key], time);
        });
    };
    Input.prototype.updateAxis = function (axis, time) {
        var posValue = this.getButtonValue(axis.getPosButton()), negValue = this.getButtonValue(axis.getNegButton());
        axis.UNSAFE_update(time, axis.getValue(), negValue !== 0.0, posValue !== 0.0);
    };
    Input.prototype._addInputHandler = function (inputHandler) {
        var InputHandler = inputHandler.getConstructor();
        if (!this.inputHandlerMap.has(InputHandler)) {
            this.inputHandlers.push(inputHandler);
            this.inputHandlerMap.set(InputHandler, inputHandler);
            inputHandler.UNSAFE_setInput(this);
            inputHandler.onAdd();
            this.emit("add-input_handler", inputHandler);
        }
        return this;
    };
    Input.prototype._removeInputHandler = function (InputHandler) {
        var _this = this;
        this.getInputHandler(InputHandler).ifSome(function (inputHandler) {
            _this.emit("remove-input_handler", inputHandler);
            inputHandler.onRemove();
            _this.inputHandlers.splice(_this.inputHandlers.indexOf(inputHandler), 1);
            _this.inputHandlerMap.delete(InputHandler);
            inputHandler.UNSAFE_removeInput();
        });
        return this;
    };
    Input.prototype._addEventListener = function (eventListener) {
        var EventListener = eventListener.getConstructor();
        if (!this.eventListenerMap.has(EventListener)) {
            this.eventListeners.push(eventListener);
            this.eventListenerMap.set(EventListener, eventListener);
            eventListener.UNSAFE_setInput(this);
            eventListener.onAdd();
            this.emit("add-event_listener", eventListener);
        }
        return this;
    };
    Input.prototype._removeEventListener = function (EventListener) {
        var _this = this;
        this.getEventListener(EventListener).ifSome(function (eventListener) {
            _this.emit("remove-event_listener", eventListener);
            eventListener.onRemove();
            _this.eventListeners.splice(_this.eventListeners.indexOf(eventListener), 1);
            _this.eventListenerMap.delete(EventListener);
            eventListener.UNSAFE_removeInput();
        });
        return this;
    };
    return Input;
}(Plugin_1.Plugin));
exports.Input = Input;
