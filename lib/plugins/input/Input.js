"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const core_1 = require("@aicacia/core");
const Plugin_1 = require("@aicacia/ecs/lib/Plugin");
const Time_1 = require("../Time");
const InputAxis_1 = require("./InputAxis");
const InputButton_1 = require("./InputButton");
const InputHandler_1 = require("./InputHandler");
const MouseInputHandler_1 = require("./MouseInputHandler");
const KeyboardInputHandler_1 = require("./KeyboardInputHandler");
const TouchInputHandler_1 = require("./TouchInputHandler");
const ResizeInputHandler_1 = require("./ResizeInputHandler");
const json_1 = require("@aicacia/json");
class Input extends Plugin_1.Plugin {
    constructor() {
        super();
        this.events = [];
        this.inputHandlers = [];
        this.inputHandlerMap = new Map();
        this.eventListeners = [];
        this.eventListenerMap = new Map();
        this.buttons = {};
        this.axes = {};
        this.addInputHandler(new MouseInputHandler_1.MouseInputHandler(), new KeyboardInputHandler_1.KeyboardInputHandler(), new TouchInputHandler_1.TouchInputHandler(), new ResizeInputHandler_1.ResizeInputHandler());
        this.addAxis(new InputAxis_1.InputAxis("horizontal-keys", "ArrowLeft", "ArrowRight"), new InputAxis_1.InputAxis("vertical-keys", "ArrowDown", "ArrowUp"));
    }
    queueEvent(event) {
        this.emit("event", event);
        this.events.push(event);
        return this;
    }
    addAxes(axes) {
        axes.forEach((axis) => this._addAxis(axis));
        return this;
    }
    addAxis(...axes) {
        return this.addAxes(axes);
    }
    getAxis(name) {
        return core_1.Option.from(this.axes[name]);
    }
    getAxisValue(name) {
        return this.getAxis(name)
            .map((axis) => axis.getValue())
            .unwrapOr(0.0);
    }
    getRequiredAxis(name) {
        return this.getAxis(name).expect(`Failed to get Required Axis ${name}`);
    }
    getInputHandler(InputHandler) {
        return core_1.Option.from(this.inputHandlerMap.get(InputHandler));
    }
    getRequiredInputHandler(InputHandler) {
        return this.getInputHandler(InputHandler).expect(`Failed to get Required InputHandler ${InputHandler}`);
    }
    getEventListener(EventListener) {
        return core_1.Option.from(this.eventListenerMap.get(EventListener));
    }
    getRequiredEventListener(EventListener) {
        return this.getEventListener(EventListener).expect(`Failed to get Required EventListener ${EventListener}`);
    }
    removeAxes(axes) {
        axes.forEach((axis) => this._removeAxis(axis));
        return this;
    }
    removeAxis(...axes) {
        return this.removeAxes(axes);
    }
    addInputHandlers(inputHandlers) {
        inputHandlers.forEach((inputHandler) => this._addInputHandler(inputHandler));
        return this;
    }
    addInputHandler(...inputHandlers) {
        return this.addInputHandlers(inputHandlers);
    }
    removeInputHandlers(inputHandlers) {
        inputHandlers.forEach((inputHandler) => this._removeInputHandler(inputHandler));
        return this;
    }
    removeInputHandler(...inputHandlers) {
        return this.removeInputHandlers(inputHandlers);
    }
    addEventListeners(eventListeners) {
        eventListeners.forEach((eventListener) => this._addEventListener(eventListener));
        return this;
    }
    addEventListener(...eventListeners) {
        return this.addEventListeners(eventListeners);
    }
    removeEventListeners(eventListeners) {
        eventListeners.forEach((eventListener) => this._removeEventListener(eventListener));
        return this;
    }
    removeEventListener(...eventListeners) {
        return this.removeEventListeners(eventListeners);
    }
    getOrCreateButton(name) {
        const button = this.buttons[name];
        if (button) {
            return button;
        }
        else {
            const newButton = new InputButton_1.InputButton(name);
            this.buttons[name] = newButton;
            return newButton;
        }
    }
    getButton(name) {
        return core_1.Option.from(this.buttons[name]);
    }
    getButtonValue(name) {
        return this.getButton(name)
            .map((button) => button.getValue())
            .unwrapOr(0.0);
    }
    isDownCurrentFrame(name) {
        return this.getButton(name)
            .map((button) => button.getFrameDown() === this.getRequiredPlugin(Time_1.Time).getFrame())
            .unwrapOr(false);
    }
    isDown(name) {
        return !this.isUp(name);
    }
    isUpCurrentFrame(name) {
        return this.getButton(name)
            .map((button) => button.getFrameUp() === this.getRequiredPlugin(Time_1.Time).getFrame())
            .unwrapOr(false);
    }
    isUp(name) {
        return this.getButtonValue(name) == 0.0;
    }
    onUpdate() {
        const time = this.getRequiredPlugin(Time_1.Time);
        this.eventListeners.forEach((eventListener) => eventListener.onUpdate(time));
        this.inputHandlers.forEach((inputHandler) => {
            this.events.forEach((event) => inputHandler.onEvent(time, event));
            inputHandler.onUpdate(time);
        });
        this.events.forEach((event) => this.emit(event.type, event));
        this.eventListeners.forEach((eventListener) => {
            for (let i = 0; i < this.events.length; i++) {
                const event = this.events[i];
                if (eventListener.dequeueEvent(event)) {
                    this.events.splice(i, 1);
                    i--;
                }
            }
        });
        this.events.length = 0;
        this.updateAxes(time);
        return this;
    }
    onAfterUpdate() {
        const time = this.getRequiredPlugin(Time_1.Time);
        this.eventListeners.forEach((eventListener) => eventListener.onAfterUpdate(time));
        this.inputHandlers.forEach((inputHandler) => inputHandler.onAfterUpdate(time));
        return this;
    }
    _addAxis(axis) {
        if (!this.axes[axis.getName()]) {
            this.axes[axis.getName()] = axis;
        }
        return this;
    }
    _removeAxis(axis) {
        if (this.axes[axis.getName()]) {
            delete this.axes[axis.getName()];
        }
        return this;
    }
    updateAxes(time) {
        Object.keys(this.axes).forEach((key) => this.updateAxis(this.axes[key], time));
    }
    updateAxis(axis, time) {
        const posValue = this.getButtonValue(axis.getPosButton()), negValue = this.getButtonValue(axis.getNegButton());
        axis.UNSAFE_update(time, axis.getValue(), negValue !== 0.0, posValue !== 0.0);
    }
    _addInputHandler(inputHandler) {
        const InputHandler = inputHandler.getConstructor();
        if (!this.inputHandlerMap.has(InputHandler)) {
            this.inputHandlers.push(inputHandler);
            this.inputHandlerMap.set(InputHandler, inputHandler);
            inputHandler.UNSAFE_setInput(this);
            inputHandler.onAdd();
            this.emit("add-input_handler", inputHandler);
        }
        return this;
    }
    _removeInputHandler(InputHandler) {
        this.getInputHandler(InputHandler).ifSome((inputHandler) => {
            this.emit("remove-input_handler", inputHandler);
            inputHandler.onRemove();
            this.inputHandlers.splice(this.inputHandlers.indexOf(inputHandler), 1);
            this.inputHandlerMap.delete(InputHandler);
            inputHandler.UNSAFE_removeInput();
        });
        return this;
    }
    _addEventListener(eventListener) {
        const EventListener = eventListener.getConstructor();
        if (!this.eventListenerMap.has(EventListener)) {
            this.eventListeners.push(eventListener);
            this.eventListenerMap.set(EventListener, eventListener);
            eventListener.UNSAFE_setInput(this);
            eventListener.onAdd();
            this.emit("add-event_listener", eventListener);
        }
        return this;
    }
    _removeEventListener(EventListener) {
        this.getEventListener(EventListener).ifSome((eventListener) => {
            this.emit("remove-event_listener", eventListener);
            eventListener.onRemove();
            this.eventListeners.splice(this.eventListeners.indexOf(eventListener), 1);
            this.eventListenerMap.delete(EventListener);
            eventListener.UNSAFE_removeInput();
        });
        return this;
    }
    toJSON() {
        return Object.assign(Object.assign({}, super.toJSON()), { buttons: Object.values(this.buttons).map((button) => button.toJSON()), axes: Object.values(this.axes).map((axis) => axis.toJSON()), inputHandlers: this.inputHandlers.map((inputHandler) => inputHandler.toJSON()) });
    }
    fromJSON(json) {
        super.fromJSON(json);
        if (json_1.isJSONArray(json.buttons)) {
            json.buttons.forEach((json) => {
                const buttonJSON = json, button = new InputButton_1.InputButton(buttonJSON.name).fromJSON(buttonJSON);
                this.buttons[button.getName()] = button;
            });
        }
        if (json_1.isJSONArray(json.axes)) {
            this.addAxes(json.axes.map((json) => {
                const axisJSON = json;
                return new InputAxis_1.InputAxis(axisJSON.name, axisJSON.negButton, axisJSON.posButton).fromJSON(axisJSON);
            }));
        }
        if (json_1.isJSONArray(json.inputHandlers)) {
            this.addInputHandlers(json.inputHandlers.map((json) => InputHandler_1.InputHandler.newFromJSON(json)));
        }
        return this;
    }
}
exports.Input = Input;
