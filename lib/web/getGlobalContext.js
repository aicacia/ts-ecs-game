"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGlobalContext = void 0;
const core_1 = require("@aicacia/core");
const getGlobalCanvas_1 = require("./getGlobalCanvas");
const CONTEXT = core_1.none();
function getGlobalContext() {
    if (CONTEXT.isSome()) {
        return CONTEXT.unwrap();
    }
    else {
        const context = getGlobalCanvas_1.getGlobalCanvas().getContext("2d");
        CONTEXT.replace(context);
        return context;
    }
}
exports.getGlobalContext = getGlobalContext;
