"use strict";
exports.__esModule = true;
var Operation_1 = require("./Operation");
print("running index");
var op = (0, Operation_1.newOperation)("stone above 30deg", [], Operation_1.OperationType.applyTerrain, [29]);
// @ts-ignore
(0, Operation_1.executeOperations)([op], world.getDimension(0));
//# sourceMappingURL=index.js.map