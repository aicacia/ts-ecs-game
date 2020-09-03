"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebEventListener = void 0;
var tslib_1 = require("tslib");
var EventListener_1 = require("./EventListener");
var Pool_1 = require("../../utils/Pool");
var TouchInputEvent_1 = require("./TouchInputEvent");
var MouseWheelInputEvent_1 = require("./MouseWheelInputEvent");
var KeyboardInputEvent_1 = require("./KeyboardInputEvent");
var MouseInputEvent_1 = require("./MouseInputEvent");
var ResizeInputEvent_1 = require("./ResizeInputEvent");
var WebEventListener = /** @class */ (function (_super) {
    tslib_1.__extends(WebEventListener, _super);
    function WebEventListener(element) {
        var _this = _super.call(this) || this;
        _this.touchInputEventPool = new Pool_1.Pool(TouchInputEvent_1.TouchInputEvent);
        _this.mouseInputEventPool = new Pool_1.Pool(MouseInputEvent_1.MouseInputEvent);
        _this.mouseWheelInputEventPool = new Pool_1.Pool(MouseWheelInputEvent_1.MouseWheelInputEvent);
        _this.keyboardInputEventPool = new Pool_1.Pool(KeyboardInputEvent_1.KeyboardInputEvent);
        _this.resizeInputEventPool = new Pool_1.Pool(ResizeInputEvent_1.ResizeInputEvent);
        _this.onResize = function () {
            var event = _this.resizeInputEventPool.create("resize");
            event.width = _this.window.innerWidth;
            event.height = _this.window.innerHeight;
            _this.queueEvent(event);
        };
        _this.onTouch = function (e) {
            var touchEvent = e, elementRect = _this.element.getBoundingClientRect();
            for (var i = 0, il = touchEvent.touches.length; i < il; i++) {
                var touch = touchEvent.touches[i], x = touch.clientX - elementRect.left, y = touch.clientY - elementRect.top, event_1 = _this.touchInputEventPool.create(touchEvent.type);
                event_1.id = touch.identifier;
                event_1.x = x;
                event_1.y = y;
                _this.queueEvent(event_1);
            }
        };
        _this.onMouse = function (e) {
            var mouseEvent = e, elementRect = _this.element.getBoundingClientRect(), x = mouseEvent.clientX - elementRect.left, y = mouseEvent.clientY - elementRect.top, event = _this.mouseInputEventPool.create(mouseEvent.type);
            event.button = mouseEvent.which;
            event.x = x;
            event.y = y;
            _this.queueEvent(event);
        };
        _this.onMouseWheel = function (e) {
            var mouseWheelEvent = e, event = _this.mouseWheelInputEventPool.create(mouseWheelEvent.type);
            event.wheel = mouseWheelEvent.deltaY;
            _this.queueEvent(event);
        };
        _this.onKeyboard = function (e) {
            var keyEvent = e, event = _this.keyboardInputEventPool.create(keyEvent.type);
            event.code = keyEvent.code;
            _this.queueEvent(event);
        };
        _this.element = element;
        _this.window = element.ownerDocument.defaultView;
        return _this;
    }
    WebEventListener.prototype.onAdd = function () {
        this.window.addEventListener("orientationchange", this.onResize);
        this.window.addEventListener("resize", this.onResize);
        this.element.addEventListener("touchstart", this.onTouch);
        this.element.addEventListener("touchmove", this.onTouch);
        this.element.addEventListener("touchend", this.onTouch);
        this.element.addEventListener("touchcancel", this.onTouch);
        this.element.addEventListener("mousemove", this.onMouse);
        this.element.addEventListener("mousedown", this.onMouse);
        this.element.addEventListener("mouseup", this.onMouse);
        this.element.addEventListener("wheel", this.onMouseWheel);
        this.element.addEventListener("mouseleave", this.onMouse);
        this.element.addEventListener("keydown", this.onKeyboard);
        this.element.addEventListener("keyup", this.onKeyboard);
        this.onResize();
        return this;
    };
    WebEventListener.prototype.onRemove = function () {
        this.window.removeEventListener("orientationchange", this.onResize);
        this.window.removeEventListener("resize", this.onResize);
        this.element.removeEventListener("touchstart", this.onTouch);
        this.element.removeEventListener("touchmove", this.onTouch);
        this.element.removeEventListener("touchend", this.onTouch);
        this.element.removeEventListener("touchcancel", this.onTouch);
        this.element.removeEventListener("mousemove", this.onMouse);
        this.element.removeEventListener("mousedown", this.onMouse);
        this.element.removeEventListener("mouseup", this.onMouse);
        this.element.removeEventListener("wheel", this.onMouseWheel);
        this.element.removeEventListener("mouseleave", this.onMouse);
        this.element.removeEventListener("keydown", this.onKeyboard);
        this.element.removeEventListener("keyup", this.onKeyboard);
        return this;
    };
    WebEventListener.prototype.dequeueEvent = function (event) {
        if (event instanceof MouseInputEvent_1.MouseInputEvent) {
            this.mouseInputEventPool.release(event);
            return true;
        }
        else if (event instanceof KeyboardInputEvent_1.KeyboardInputEvent) {
            this.keyboardInputEventPool.release(event);
            return true;
        }
        else if (event instanceof MouseWheelInputEvent_1.MouseWheelInputEvent) {
            this.mouseWheelInputEventPool.release(event);
            return true;
        }
        else if (event instanceof TouchInputEvent_1.TouchInputEvent) {
            this.touchInputEventPool.release(event);
            return true;
        }
        else {
            return false;
        }
    };
    return WebEventListener;
}(EventListener_1.EventListener));
exports.WebEventListener = WebEventListener;
