"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camera3DManager = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@aicacia/core");
var DefaultDescriptorManager_1 = require("@aicacia/ecs/lib/DefaultDescriptorManager");
var Camera3DManager = /** @class */ (function (_super) {
    tslib_1.__extends(Camera3DManager, _super);
    function Camera3DManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.active = core_1.none();
        return _this;
    }
    Camera3DManager.prototype.setActive = function (camera) {
        var _this = this;
        if (camera
            .getManager()
            .map(function (manager) { return manager === _this; })
            .unwrapOr(false)) {
            this.active.replace(camera);
        }
        else {
            throw new Error("Camera3DManager.setActive(camera: Camera3D): cannot set active if camera is not in manager");
        }
        return this;
    };
    Camera3DManager.prototype.getActive = function () {
        return this.active;
    };
    Camera3DManager.prototype.getRequiredActive = function () {
        return this.getActive().expect("Expected an Active Camera");
    };
    Camera3DManager.prototype.addComponent = function (camera) {
        _super.prototype.addComponent.call(this, camera);
        if (this.active.isNone()) {
            this.active.replace(camera);
        }
        return this;
    };
    Camera3DManager.prototype.removeComponent = function (camera) {
        var _this = this;
        _super.prototype.removeComponent.call(this, camera);
        this.active.ifSome(function (active) {
            if (active === camera) {
                _this.active.clear();
            }
        });
        return this;
    };
    return Camera3DManager;
}(DefaultDescriptorManager_1.DefaultDescriptorManager));
exports.Camera3DManager = Camera3DManager;
