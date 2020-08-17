"use strict";
exports.__esModule = true;
exports.MouseInputHandler = void 0;
var tslib_1 = require("tslib");
var InputHandler_1 = require("./InputHandler");
var MouseInputHandler = /** @class */ (function (_super) {
    tslib_1.__extends(MouseInputHandler, _super);
    function MouseInputHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MouseInputHandler.prototype.onAdd = function () {
        var element = this.getElement();
        element.addEventListener("mousemove", this.queueEvent);
        element.addEventListener("mousedown", this.queueEvent);
        element.addEventListener("mouseup", this.queueEvent);
        element.addEventListener("wheel", this.queueEvent);
        element.addEventListener("mouseleave", this.queueEvent);
        return this;
    };
    MouseInputHandler.prototype.onRemove = function () {
        var element = this.getElement();
        element.removeEventListener("mousemove", this.queueEvent);
        element.removeEventListener("mousedown", this.queueEvent);
        element.removeEventListener("mouseup", this.queueEvent);
        element.removeEventListener("wheel", this.queueEvent);
        element.removeEventListener("mouseleave", this.queueEvent);
        return this;
    };
    MouseInputHandler.prototype.onEvent = function (time, e) {
        var input = this.getRequiredInput(), elementRect = input.getElement().getBoundingClientRect();
        switch (e.type) {
            case "mousemove":
                var x = e.clientX - elementRect.left, y = e.clientY - elementRect.top;
                input.getOrCreateButton("mouseX").UNSAFE_setValue(x);
                input.getOrCreateButton("mouseY").UNSAFE_setValue(y);
                break;
            case "mousedown":
                input.getOrCreateButton("mouse" + e.which).UNSAFE_down(time.getFrame());
                break;
            case "mouseup":
            case "mouseleave":
                input.getOrCreateButton("mouse" + e.which).UNSAFE_up(time.getFrame());
                break;
            case "wheel":
                e.preventDefault();
                input
                    .getOrCreateButton("mouseWheel")
                    .UNSAFE_setValue(e.deltaY);
                break;
        }
        return this;
    };
    MouseInputHandler.prototype.onAfterUpdate = function () {
        this.getRequiredInput().getOrCreateButton("mouseWheel").UNSAFE_setValue(0);
        return this;
    };
    return MouseInputHandler;
}(InputHandler_1.InputHandler));
exports.MouseInputHandler = MouseInputHandler;
