"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera2DControlManager = void 0;
var tslib_1 = require("tslib");
var DefaultManager_1 = require("../../DefaultManager");
var Camera2DControlManager = /** @class */ (function (_super) {
    tslib_1.__extends(Camera2DControlManager, _super);
    function Camera2DControlManager() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Camera2DControlManager.prototype.onInit = function () {
        return this;
    };
    Camera2DControlManager.prototype.onAfterUpdate = function () {
        return this;
    };
    return Camera2DControlManager;
}(DefaultManager_1.DefaultManager));
exports.Camera2DControlManager = Camera2DControlManager;
