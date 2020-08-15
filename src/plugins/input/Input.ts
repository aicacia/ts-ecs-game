import { Option, IConstructor } from "@aicacia/core";
import { Plugin } from "../../sceneGraph";
import { Time } from "../Time";
import { InputAxis } from "./InputAxis";
import { InputButton } from "./InputButton";
import { InputHandler } from "./InputHandler";
import { KeyboardInputHandler } from "./KeyboardInputHandler";
import { MouseInputHandler } from "./MouseInputHandler";

export class Input extends Plugin {
  static pluginPriority = -Infinity;

  private element: Element;
  private inputHandlers: InputHandler[] = [];
  private inputHandlerMap: Map<
    IConstructor<InputHandler>,
    InputHandler
  > = new Map();
  private buttons: { [key: string]: InputButton } = {};
  private axes: { [key: string]: InputAxis } = {};

  constructor(element: Element) {
    super();

    this.element = element;

    this.addInputHandler(new MouseInputHandler(), new KeyboardInputHandler());
    this.addAxes(
      new InputAxis("horizontal-keys", "ArrowLeft", "ArrowRight"),
      new InputAxis("vertical-keys", "ArrowDown", "ArrowUp")
    );
  }

  getElement() {
    return this.element;
  }

  addAxes(...axes: InputAxis[]) {
    axes.forEach((axis) => this._addAxis(axis));
    return this;
  }
  addAxis(...axes: InputAxis[]) {
    return this.addAxes(...axes);
  }
  getAxis(name: string) {
    return Option.from(this.axes[name]);
  }
  getAxisValue(name: string) {
    return this.getAxis(name).map((axis) => axis.getValue());
  }

  getRequiredAxis(name: string) {
    return this.getAxis(name).expect(`Failed to get Required Axis ${name}`);
  }
  getRequiredAxisValue(name: string) {
    return this.getAxisValue(name).expect(
      `Failed to get Required Axis value for ${name}`
    );
  }

  getInputHandler<I extends InputHandler = InputHandler>(
    InputHandler: IConstructor<I>
  ) {
    return Option.from(this.inputHandlerMap.get(InputHandler));
  }
  getRequiredInputHandler<I extends InputHandler = InputHandler>(
    InputHandler: IConstructor<I>
  ) {
    return this.getInputHandler(InputHandler).expect(
      `Failed to get Required InputHandler ${InputHandler}`
    );
  }

  removeAxes(...axes: InputAxis[]) {
    axes.forEach((axis) => this._removeAxis(axis));
    return this;
  }
  removeAxis(...axes: InputAxis[]) {
    return this.removeAxes(...axes);
  }

  addInputHandlers(...inputHandlers: InputHandler[]) {
    inputHandlers.forEach((inputHandler) =>
      this._addInputHandler(inputHandler)
    );
    return this;
  }
  addInputHandler(...inputHandlers: InputHandler[]) {
    return this.addInputHandlers(...inputHandlers);
  }

  removeInputHandlers(...inputHandlers: IConstructor<InputHandler>[]) {
    inputHandlers.forEach((inputHandler) =>
      this._removeInputHandler(inputHandler)
    );
    return this;
  }
  removeInputHandler(...inputHandlers: IConstructor<InputHandler>[]) {
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
      .map((button) => button.getValue())
      .unwrapOr(0.0);
  }

  isDown(name: string) {
    return this.getButton(name)
      .map(
        (button) =>
          button.getFrameDown() === this.getRequiredPlugin(Time).getFrame()
      )
      .unwrapOr(false);
  }
  isUp(name: string) {
    return this.getButton(name)
      .map(
        (button) =>
          button.getFrameUp() === this.getRequiredPlugin(Time).getFrame()
      )
      .unwrapOr(false);
  }

  onUpdate() {
    const time = this.getRequiredPlugin(Time);
    this.updateAxes(time);
    this.inputHandlers.forEach((inputHandler) => inputHandler.onUpdate(time));
    return this;
  }

  onAfterUpdate() {
    const time = this.getRequiredPlugin(Time);
    this.inputHandlers.forEach((inputHandler) =>
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
    Object.keys(this.axes).forEach((key) =>
      this.updateAxis(this.axes[key], time)
    );
  }

  private updateAxis(axis: InputAxis, time: Time) {
    const posValue = this.getValue(axis.getPosButton()),
      negValue = this.getValue(axis.getNegButton());

    axis.UNSAFE_update(
      time,
      axis.getValue(),
      negValue !== 0.0,
      posValue !== 0.0
    );
  }

  private _addInputHandler<I extends InputHandler = InputHandler>(
    inputHandler: I
  ) {
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
  private _removeInputHandler<I extends InputHandler = InputHandler>(
    InputHandler: IConstructor<I>
  ) {
    this.getInputHandler(InputHandler).ifSome((inputHandler) => {
      this.emit("remove-input_handler", inputHandler);
      inputHandler.onRemove();

      this.inputHandlers.splice(this.inputHandlers.indexOf(inputHandler), 1);
      this.inputHandlerMap.delete(InputHandler);
      inputHandler.UNSAFE_removeInput();
    });
    return this;
  }
}
