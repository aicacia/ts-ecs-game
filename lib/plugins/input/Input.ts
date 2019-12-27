import { Option } from "@aicacia/core";
import { Plugin } from "../../sceneGraph";
import { Time } from "../Time";
import { InputAxis } from "./InputAxis";
import { InputButton } from "./InputButton";
import { InputHandler } from "./InputHandler";
import { KeyboardInputHandler } from "./KeyboardInputHandler";
import { MouseInputHandler } from "./MouseInputHandler";

export class Input extends Plugin {
  static pluginName = "engine.Input";
  static pluginPriority = -Infinity;

  private element: Element;
  private inputHandlers: InputHandler[] = [];
  private inputHandlerMap: Record<string, InputHandler> = {};
  private buttons: { [key: string]: InputButton } = {};
  private axes: { [key: string]: InputAxis } = {};

  constructor(element: Element) {
    super();

    this.element = element;

    this.addInputHandler(new MouseInputHandler(), new KeyboardInputHandler());

    this.addAxis(new InputAxis("mouse", "mouseX", "mouseY"));
  }

  getElement() {
    return this.element;
  }

  addAxes(...axes: InputAxis[]) {
    axes.forEach(axis => this._addAxis(axis));
    return this;
  }
  addAxis(...axes: InputAxis[]) {
    return this.addAxes(...axes);
  }

  removeAxes(...axes: InputAxis[]) {
    axes.forEach(axis => this._removeAxis(axis));
    return this;
  }
  removeAxis(...axes: InputAxis[]) {
    return this.removeAxes(...axes);
  }

  addInputHandlers(...inputHandlers: InputHandler[]) {
    inputHandlers.forEach(inputHandler => this._addInputHandler(inputHandler));
    return this;
  }
  addInputHandler(...inputHandlers: InputHandler[]) {
    return this.addInputHandlers(...inputHandlers);
  }

  removeInputHandlers(...inputHandlers: Array<new () => InputHandler>) {
    inputHandlers.forEach(inputHandler =>
      this._removeInputHandler(inputHandler)
    );
    return this;
  }
  removeInputHandler(...inputHandlers: Array<new () => InputHandler>) {
    return this.removeInputHandlers(...inputHandlers);
  }

  getOrCreateButton(name: string) {
    let button = this.buttons[name];

    if (!button) {
      button = new InputButton(name);
      this.buttons[name] = button;
    }

    return button;
  }
  getButton(name: string) {
    return Option.from(this.buttons[name]);
  }
  getValue(name: string) {
    return this.getButton(name)
      .map(button => button.getValue())
      .unwrapOr(0.0);
  }

  isDown(name: string) {
    return this.getButton(name)
      .map(button => button.getFrameDown() === this.getTime().getFrame())
      .unwrapOr(false);
  }
  isUp(name: string) {
    return this.getButton(name)
      .map(button => button.getFrameUp() === this.getTime().getFrame())
      .unwrapOr(false);
  }

  getTime() {
    return this.getPlugin(Time).expect("Input requires the Time Plugin");
  }

  onUpdate() {
    const time = this.getTime();
    this.updateAxes(time);
    this.inputHandlers.forEach(inputHandler => inputHandler.onUpdate(time));
    return this;
  }

  onAfterUpdate() {
    const time = this.getTime();
    this.inputHandlers.forEach(inputHandler =>
      inputHandler.onAfterUpdate(time)
    );
    return this;
  }

  private _addAxis(axis: InputAxis) {
    if (!this.axes[axis.getName()]) {
      this.axes[axis.getName()] = axis;
    }
    return this;
  }

  private _removeAxis(axis: InputAxis) {
    if (this.axes[axis.getName()]) {
      delete this.axes[axis.getName()];
    }
    return this;
  }

  private updateAxes(time: Time) {
    Object.keys(this.axes).forEach(key =>
      this.updateAxis(this.axes[key], time)
    );
  }

  private updateAxis(axis: InputAxis, time: Time) {
    const posValue = this.getValue(axis.getPosButton()),
      negValue = this.getValue(axis.getNegButton());

    axis.UNSAFE_update(
      time,
      axis.getValue(),
      posValue !== 0.0,
      negValue !== 0.0
    );
  }

  private _addInputHandler<T extends InputHandler>(inputHandler: T) {
    const inputHandlerName = inputHandler.getInputHandlerName();

    if (!this.inputHandlerMap[inputHandlerName]) {
      this.inputHandlers.push(inputHandler);
      this.inputHandlerMap[inputHandlerName] = inputHandler;
      inputHandler.UNSAFE_setInput(this);
      inputHandler.onAdd();
      this.emit("add-input_handler", inputHandler);
    }

    return this;
  }
  private _removeInputHandler<T extends InputHandler>(
    InputHandler: new () => T
  ) {
    const inputHandlerName = (InputHandler as any).getInputName(),
      inputHandler = this.inputHandlerMap[inputHandlerName];

    if (inputHandler) {
      this.emit("remove-input_handler", inputHandler);
      inputHandler.onRemove();

      this.inputHandlers.splice(this.inputHandlers.indexOf(inputHandler), 1);
      delete this.inputHandlerMap[inputHandlerName];
      inputHandler.UNSAFE_removeInput();
    }

    return this;
  }
}
