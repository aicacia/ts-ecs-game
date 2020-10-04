"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera2DManager = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var DefaultDescriptorManager_1 = require("../../DefaultDescriptorManager");
var Camera2DManager = /** @class */ (function (_super) {
    tslib_1.__extends(Camera2DManager, _super);
    function Camera2DManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.active = core_1.none();
        return _this;
    }
    Camera2DManager.prototype.setActive = function (camera) {
        var _this = this;
        if (camera
            .getManager()
            .map(function (manager) { return manager === _this; })
            .unwrapOr(false)) {
            this.active.replace(camera);
        }
        else {
            throw new Error("Camera2DManager.setActive(camera: Camera2D): cannot set active if camera is not in manager");
        }
        return this;
    };
    Camera2DManager.prototype.getActive = function () {
        return this.active;
    };
    Camera2DManager.prototype.getRequiredActive = function () {
        return this.getActive().expect("Expected an Active Camera");
    };
    Camera2DManager.prototype.addComponent = function (camera) {
        _super.prototype.addComponent.call(this, camera);
        if (this.active.isNone()) {
            this.active.replace(camera);
        }
        return this;
    };
    Camera2DManager.prototype.removeComponent = function (camera) {
        var _this = this;
        _super.prototype.removeComponent.call(this, camera);
        this.active.map(function (active) {
            if (active === camera) {
                _this.active.clear();
            }
        });
        return this;
    };
    return Camera2DManager;
}(DefaultDescriptorManager_1.DefaultDescriptorManager));
exports.Camera2DManager = Camera2DManager;