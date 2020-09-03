"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseWheelInputEvent = void 0;
var tslib_1 = require("tslib");
var InputEvent_1 = require("./InputEvent");
var MouseWheelInputEvent = /** @class */ (function (_super) {
    tslib_1.__extends(MouseWheelInputEvent, _super);
    function MouseWheelInputEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.wheel = 0;
        return _this;
    }
    return MouseWheelInputEvent;
}(InputEvent_1.InputEvent));
exports.MouseWheelInputEvent = MouseWheelInputEvent;
