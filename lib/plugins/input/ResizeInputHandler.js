"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizeInputHandler = void 0;
var tslib_1 = require("tslib");
var InputHandler_1 = require("./InputHandler");
var ResizeInputHandler = /** @class */ (function (_super) {
    tslib_1.__extends(ResizeInputHandler, _super);
    function ResizeInputHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ResizeInputHandler.prototype.onEvent = function (_time, event) {
        var input = this.getRequiredInput();
        switch (event.type) {
            case "resize":
                input.getOrCreateButton("screen-width").UNSAFE_setValue(event.width);
                input.getOrCreateButton("screen-height").UNSAFE_setValue(event.height);
                break;
        }
        return this;
    };
    return ResizeInputHandler;
}(InputHandler_1.InputHandler));
exports.ResizeInputHandler = ResizeInputHandler;
