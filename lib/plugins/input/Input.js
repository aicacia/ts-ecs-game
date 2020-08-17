"use strict";
exports.__esModule = true;
exports.Input = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var sceneGraph_1 = require("../../sceneGraph");
var Time_1 = require("../Time");
var InputAxis_1 = require("./InputAxis");
var InputButton_1 = require("./InputButton");
var KeyboardInputHandler_1 = require("./KeyboardInputHandler");
var MouseInputHandler_1 = require("./MouseInputHandler");
var Input = /** @class */ (function (_super) {
    tslib_1.__extends(Input, _super);
    function Input(element) {
        var _this = _super.call(this) || this;
        _this.inputHandlers = [];
        _this.inputHandlerMap = new Map();
        _this.buttons = {};
        _this.axes = {};
        _this.element = element;
        _this.addInputHandler(new MouseInputHandler_1.MouseInputHandler(), new KeyboardInputHandler_1.KeyboardInputHandler());
        _this.addAxes(new InputAxis_1.InputAxis("horizontal-keys", "ArrowLeft", "ArrowRight"), new InputAxis_1.InputAxis("vertical-keys", "ArrowDown", "ArrowUp"));
        return _this;
    }
    Input.prototype.getElement = function () {
        return this.element;
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
        return this.getAxis(name).map(function (axis) { return axis.getValue(); });
    };
    Input.prototype.getRequiredAxis = function (name) {
        return this.getAxis(name).expect("Failed to get Required Axis " + name);
    };
    Input.prototype.getRequiredAxisValue = function (name) {
        return this.getAxisValue(name).expect("Failed to get Required Axis value for " + name);
    };
    Input.prototype.getInputHandler = function (InputHandler) {
        return core_1.Option.from(this.inputHandlerMap.get(InputHandler));
    };
    Input.prototype.getRequiredInputHandler = function (InputHandler) {
        return this.getInputHandler(InputHandler).expect("Failed to get Required InputHandler " + InputHandler);
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
    Input.prototype.getOrCreateButton = function (name) {
        var button = this.buttons[name];
        if (!button) {
            button = new InputButton_1.InputButton(name);
            this.buttons[name] = button;
        }
        return button;
    };
    Input.prototype.getButton = function (name) {
        return core_1.Option.from(this.buttons[name]);
    };
    Input.prototype.getValue = function (name) {
        return this.getButton(name)
            .map(function (button) { return button.getValue(); })
            .unwrapOr(0.0);
    };
    Input.prototype.isDown = function (name) {
        var _this = this;
        return this.getButton(name)
            .map(function (button) {
            return button.getFrameDown() === _this.getRequiredPlugin(Time_1.Time).getFrame();
        })
            .unwrapOr(false);
    };
    Input.prototype.isUp = function (name) {
        var _this = this;
        return this.getButton(name)
            .map(function (button) {
            return button.getFrameUp() === _this.getRequiredPlugin(Time_1.Time).getFrame();
        })
            .unwrapOr(false);
    };
    Input.prototype.onUpdate = function () {
        var time = this.getRequiredPlugin(Time_1.Time);
        this.updateAxes(time);
        this.inputHandlers.forEach(function (inputHandler) { return inputHandler.onUpdate(time); });
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
        var posValue = this.getValue(axis.getPosButton()), negValue = this.getValue(axis.getNegButton());
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
            _this.inputHandlerMap["delete"](InputHandler);
            inputHandler.UNSAFE_removeInput();
        });
        return this;
    };
    Input.pluginPriority = -Infinity;
    return Input;
}(sceneGraph_1.Plugin));
exports.Input = Input;
