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

  UNSAFE_set(name: string, value: number = 0) {
    let button = this.buttons[name];

    if (!button) {
      button = new InputButton(name);
      this.buttons[name] = button;
    }

    button.UNSAFE_setValue(value);

    return this;
  }
  getButton(name: string) {
    return Option.from(this.buttons[name]);
  }
  get(name: string) {
    return this.getButton(name)
      .map(button => button.getValue())
      .unwrapOr(0.0);
  }

  onUpdate() {
    const delta = this.getScene()
      .flatMap(scene => scene.getPlugin(Time))
      .map(time => time.getDelta())
      .unwrapOr(1.0 / 60.0);
    this.updateAxes(delta);
    this.inputHandlers.forEach(inputHandler => inputHandler.onUpdate());
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

  private updateAxes(dt: number) {
    Object.keys(this.axes).forEach(key => this.updateAxis(this.axes[key], dt));
  }

  private updateAxis(axis: InputAxis, delta: number) {
    const posValue = this.get(axis.getPosButton()),
      negValue = this.get(axis.getNegButton());

    axis.UNSAFE_update(
      delta,
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
