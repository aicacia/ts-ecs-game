"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseInputHandler = void 0;
var tslib_1 = require("tslib");
var InputHandler_1 = require("./InputHandler");
var MouseInputHandler = /** @class */ (function (_super) {
    tslib_1.__extends(MouseInputHandler, _super);
    function MouseInputHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MouseInputHandler.prototype.onEvent = function (time, event) {
        var input = this.getRequiredInput();
        switch (event.type) {
            case "mousemove":
                input.getOrCreateButton("mouse-x").UNSAFE_setValue(event.x);
                input.getOrCreateButton("mouse-y").UNSAFE_setValue(event.y);
                break;
            case "mousedown":
                input.getOrCreateButton("mouse-x").UNSAFE_setValue(event.x);
                input.getOrCreateButton("mouse-y").UNSAFE_setValue(event.y);
                input
                    .getOrCreateButton("mouse-" + event.button)
                    .UNSAFE_down(time.getFrame());
                break;
            case "mouseup":
            case "mouseleave":
                input.getOrCreateButton("mouse-x").UNSAFE_setValue(event.x);
                input.getOrCreateButton("mouse-y").UNSAFE_setValue(event.y);
                input
                    .getOrCreateButton("mouse-" + event.button)
                    .UNSAFE_up(time.getFrame());
                break;
            case "wheel":
                input.getOrCreateButton("mouse-wheel").UNSAFE_setValue(event.wheel);
                break;
        }
        return this;
    };
    MouseInputHandler.prototype.onAfterUpdate = function () {
        this.getRequiredInput().getOrCreateButton("mouse-wheel").UNSAFE_setValue(0);
        return this;
    };
    return MouseInputHandler;
}(InputHandler_1.InputHandler));
exports.MouseInputHandler = MouseInputHandler;
