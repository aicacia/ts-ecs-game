"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResizeInputEvent = void 0;
var tslib_1 = require("tslib");
var InputEvent_1 = require("./InputEvent");
var ResizeInputEvent = /** @class */ (function (_super) {
    tslib_1.__extends(ResizeInputEvent, _super);
    function ResizeInputEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.width = 0;
        _this.height = 0;
        return _this;
    }
    return ResizeInputEvent;
}(InputEvent_1.InputEvent));
exports.ResizeInputEvent = ResizeInputEvent;
