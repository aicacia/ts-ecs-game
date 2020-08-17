"use strict";
exports.__esModule = true;
exports.SpriteClip = void 0;
var SpriteClip = /** @class */ (function () {
    function SpriteClip() {
        this.duration = 1.0;
        this.x = 0;
        this.y = 0;
        this.width = 1;
        this.height = 1;
    }
    SpriteClip.prototype.getDuration = function () {
        return this.duration;
    };
    SpriteClip.prototype.setDuration = function (duration) {
        this.duration = duration;
        return this;
    };
    SpriteClip.prototype.getX = function () {
        return this.x;
    };
    SpriteClip.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    SpriteClip.prototype.getY = function () {
        return this.y;
    };
    SpriteClip.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    SpriteClip.prototype.getWidth = function () {
        return this.width;
    };
    SpriteClip.prototype.setWidth = function (width) {
        this.width = width;
        return this;
    };
    SpriteClip.prototype.getHeight = function () {
        return this.height;
    };
    SpriteClip.prototype.setHeight = function (height) {
        this.height = height;
        return this;
    };
    SpriteClip.prototype.toJSON = function () {
        return {
            duration: this.duration,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    };
    SpriteClip.prototype.fromJSON = function (json) {
        this.duration = json.duration;
        this.x = json.x;
        this.y = json.y;
        this.width = json.width;
        this.height = json.height;
        return this;
    };
    return SpriteClip;
}());
exports.SpriteClip = SpriteClip;
