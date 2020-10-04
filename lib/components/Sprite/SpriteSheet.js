"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpriteSheet = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var Component_1 = require("../../Component");
var __1 = require("../..");
var Sprite_1 = require("./Sprite");
var SpriteSheet = /** @class */ (function (_super) {
    tslib_1.__extends(SpriteSheet, _super);
    function SpriteSheet() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.currentTime = 0;
        _this.currentFrame = 0;
        _this.playBack = 1;
        _this.currentName = core_1.none();
        _this.spriteSheets = {};
        _this.get = function (name) {
            return core_1.Option.from(_this.spriteSheets[name]);
        };
        return _this;
    }
    SpriteSheet.prototype.set = function (name, spriteClips) {
        this.spriteSheets[name] = spriteClips;
        return this;
    };
    SpriteSheet.prototype.getPlayBack = function () {
        return this.playBack;
    };
    SpriteSheet.prototype.setPlayBack = function (playBack) {
        this.playBack = playBack;
        return this;
    };
    SpriteSheet.prototype.setCurrent = function (name) {
        if (!this.spriteSheets.hasOwnProperty(name)) {
            throw new Error("SpriteSheet setCurrent(name: string) no SpriteSheet found named " + name);
        }
        this.currentName.replace(name);
        this.currentFrame = 0;
        this.currentTime = 0;
        return this;
    };
    SpriteSheet.prototype.getCurrent = function () {
        return this.currentName.flatMap(this.get);
    };
    SpriteSheet.prototype.onUpdate = function () {
        var _this = this;
        this.getCurrent().ifSome(function (clips) {
            var clip = clips[_this.currentFrame];
            if (clip) {
                var sprite = _this.getRequiredComponent(Sprite_1.Sprite);
                sprite.setClipX(clip.getX());
                sprite.setClipY(clip.getY());
                sprite.setClipWidth(clip.getWidth());
                sprite.setClipHeight(clip.getHeight());
                if (_this.currentTime >= clip.getDuration()) {
                    _this.currentTime = 0;
                    _this.currentFrame += 1;
                    if (_this.currentFrame >= clips.length) {
                        _this.currentFrame = 0;
                    }
                }
                _this.currentTime +=
                    _this.getRequiredPlugin(__1.Time).getDelta() * _this.playBack;
            }
        });
        return this;
    };
    SpriteSheet.requiredComponents = [Sprite_1.Sprite];
    SpriteSheet.requiredPlugins = [__1.Time];
    return SpriteSheet;
}(Component_1.Component));
exports.SpriteSheet = SpriteSheet;
