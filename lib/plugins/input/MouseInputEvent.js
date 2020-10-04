"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MouseInputEvent = void 0;
var tslib_1 = require("tslib");
var InputEvent_1 = require("./InputEvent");
var MouseInputEvent = /** @class */ (function (_super) {
    tslib_1.__extends(MouseInputEvent, _super);
    function MouseInputEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.button = 0;
        _this.x = 0;
        _this.y = 0;
        return _this;
    }
    return MouseInputEvent;
}(InputEvent_1.InputEvent));
exports.MouseInputEvent = MouseInputEvent;
