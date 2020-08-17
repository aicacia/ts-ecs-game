"use strict";
exports.__esModule = true;
exports.KeyboardInputHandler = void 0;
var tslib_1 = require("tslib");
var InputHandler_1 = require("./InputHandler");
var KeyboardInputHandler = /** @class */ (function (_super) {
    tslib_1.__extends(KeyboardInputHandler, _super);
    function KeyboardInputHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyboardInputHandler.prototype.onAdd = function () {
        window.addEventListener("keydown", this.queueEvent);
        window.addEventListener("keyup", this.queueEvent);
        return this;
    };
    KeyboardInputHandler.prototype.onRemove = function () {
        window.removeEventListener("keydown", this.queueEvent);
        window.removeEventListener("keyup", this.queueEvent);
        return this;
    };
    KeyboardInputHandler.prototype.onEvent = function (time, e) {
        var input = this.getRequiredInput();
        switch (e.type) {
            case "keydown":
                input.getOrCreateButton(e.code).UNSAFE_down(time.getFrame());
                break;
            case "keyup":
                input.getOrCreateButton(e.code).UNSAFE_up(time.getFrame());
                break;
        }
        return this;
    };
    return KeyboardInputHandler;
}(InputHandler_1.InputHandler));
exports.KeyboardInputHandler = KeyboardInputHandler;
