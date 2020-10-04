"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TouchInputEvent = void 0;
var tslib_1 = require("tslib");
var InputEvent_1 = require("./InputEvent");
var TouchInputEvent = /** @class */ (function (_super) {
    tslib_1.__extends(TouchInputEvent, _super);
    function TouchInputEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = 0;
        _this.x = 0;
        _this.y = 0;
        return _this;
    }
    return TouchInputEvent;
}(InputEvent_1.InputEvent));
exports.TouchInputEvent = TouchInputEvent;
