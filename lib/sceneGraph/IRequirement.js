"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirementToString = exports.filterRequirements = void 0;
var util_1 = require("util");
function filterRequirements(missing, requirements, filter) {
    requirements.forEach(function (requirement) {
        if (util_1.isArray(requirement)) {
            if (!requirement.some(filter)) {
                missing.push(requirement);
            }
        }
        else {
            if (filter(requirement)) {
                missing.push(requirement);
            }
        }
    });
}
exports.filterRequirements = filterRequirements;
function requirementToString(requirement) {
    if (util_1.isArray(requirement)) {
        return "one of " + requirement.join(", ");
    }
    else {
        return requirement.toString();
    }
}
exports.requirementToString = requirementToString;
