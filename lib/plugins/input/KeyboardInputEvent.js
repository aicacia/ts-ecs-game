"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardInputEvent = void 0;
var tslib_1 = require("tslib");
var InputEvent_1 = require("./InputEvent");
var KeyboardInputEvent = /** @class */ (function (_super) {
    tslib_1.__extends(KeyboardInputEvent, _super);
    function KeyboardInputEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.code = "";
        return _this;
    }
    return KeyboardInputEvent;
}(InputEvent_1.InputEvent));
exports.KeyboardInputEvent = KeyboardInputEvent;
