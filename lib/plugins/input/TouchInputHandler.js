"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchInputHandler = void 0;
var tslib_1 = require("tslib");
var InputHandler_1 = require("./InputHandler");
var TouchInputHandler = /** @class */ (function (_super) {
    tslib_1.__extends(TouchInputHandler, _super);
    function TouchInputHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TouchInputHandler.prototype.onEvent = function (time, event) {
        var input = this.getRequiredInput();
        switch (event.type) {
            case "touchstart":
                input.getOrCreateButton("touch-" + event.id + "-x").UNSAFE_setValue(event.x);
                input.getOrCreateButton("touch-" + event.id + "-y").UNSAFE_setValue(event.y);
                input
                    .getOrCreateButton("touch-" + event.id)
                    .UNSAFE_down(time.getFrame());
                break;
            case "touchmove":
                input.getOrCreateButton("touch-" + event.id + "-x").UNSAFE_setValue(event.x);
                input.getOrCreateButton("touch-" + event.id + "-y").UNSAFE_setValue(event.y);
                break;
            case "touchend":
                input.getOrCreateButton("touch-" + event.id).UNSAFE_up(time.getFrame());
                break;
        }
        return this;
    };
    return TouchInputHandler;
}(InputHandler_1.InputHandler));
exports.TouchInputHandler = TouchInputHandler;
