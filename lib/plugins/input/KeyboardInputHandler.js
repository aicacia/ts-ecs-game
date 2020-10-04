"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardInputHandler = void 0;
var tslib_1 = require("tslib");
var InputHandler_1 = require("./InputHandler");
var KeyboardInputHandler = /** @class */ (function (_super) {
    tslib_1.__extends(KeyboardInputHandler, _super);
    function KeyboardInputHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KeyboardInputHandler.prototype.onEvent = function (time, event) {
        var input = this.getRequiredInput();
        switch (event.type) {
            case "keydown":
                input.getOrCreateButton(event.code).UNSAFE_down(time.getFrame());
                break;
            case "keyup":
                input.getOrCreateButton(event.code).UNSAFE_up(time.getFrame());
                break;
        }
        return this;
    };
    return KeyboardInputHandler;
}(InputHandler_1.InputHandler));
exports.KeyboardInputHandler = KeyboardInputHandler;
