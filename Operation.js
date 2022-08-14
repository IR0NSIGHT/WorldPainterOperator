"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.executeOperations = exports.newOperation = exports.OperationType = void 0;
var OperationType;
(function (OperationType) {
    OperationType["applyTerrain"] = "terrain";
    OperationType["setLayer"] = "layer";
})(OperationType = exports.OperationType || (exports.OperationType = {}));
function newOperation(name, filters, type, meta) {
    switch (type) {
        case OperationType.setLayer:
            return new LayerOperation(name, getLayerById(meta[0]), meta[1], filters);
        case OperationType.applyTerrain:
            return new TerrainOperation(name, getTerrainById(meta[0]), filters);
        default: throw new TypeError("unknown operation type");
    }
}
exports.newOperation = newOperation;
function executeOperations(ops, dimension) {
    var startX = dimension.getLowestX() * 128;
    var startY = dimension.getLowestY() * 128;
    var endX = startX + dimension.getWidth() * 128;
    var endY = startY + dimension.getHeight() * 128;
    var x, y = 0;
    for (x = startX; x < endX; x++) {
        for (y = startY; y < endY; y++) {
            for (var _i = 0, ops_1 = ops; _i < ops_1.length; _i++) {
                var op = ops_1[_i];
                op.execute(x, y, dimension);
            }
        }
    }
}
exports.executeOperations = executeOperations;
var Operation = /** @class */ (function () {
    function Operation(name, onFilters) {
        this.name = name;
        this.onFilters = onFilters;
    }
    Operation.prototype.execute = function (x, y, dimension) {
        if (this.passFilter(x, y, dimension))
            this.apply(x, y, dimension);
    };
    Operation.prototype.passFilter = function (x, y, dimension) {
        for (var _i = 0, _a = this.onFilters; _i < _a.length; _i++) { //TODO allow complex forms: (A&B&C)||(D&E&!F) for filter combination
            var f = _a[_i];
            if (f.isInSelection(x, y, dimension))
                return true;
        }
    };
    Operation.prototype.apply = function (x, y, dimension) {
    };
    return Operation;
}());
var LayerOperation = /** @class */ (function (_super) {
    __extends(LayerOperation, _super);
    function LayerOperation(name, layer, layerValue, onFilters) {
        var _this = _super.call(this, name, onFilters) || this;
        // @ts-ignore
        _this.layer = layer;
        _this.layerValue = layerValue;
        _this.type = OperationType.setLayer;
        return _this;
    }
    LayerOperation.prototype.apply = function (x, y, dimension) {
        dimension.setLayerValueAt(this.layer, x, y, this.layerValue);
    };
    return LayerOperation;
}(Operation));
var TerrainOperation = /** @class */ (function (_super) {
    __extends(TerrainOperation, _super);
    function TerrainOperation(name, terrain, onFilters) {
        var _this = _super.call(this, name, onFilters) || this;
        _this.terrain = terrain;
        _this.type = OperationType.applyTerrain;
        return _this;
    }
    TerrainOperation.prototype.apply = function (x, y, dimension) {
        dimension.setTerrainAt(x, y, this.terrain);
    };
    return TerrainOperation;
}(Operation));
function getLayerById(layerId) {
    switch (layerId) {
        case "Frost": // @ts-ignore
            return org.pepsoft.worldpainter.layers.Frost.INSTANCE;
        case "Caves": // @ts-ignore
            return org.pepsoft.worldpainter.layers.Caves.INSTANCE;
        case "Caverns": // @ts-ignore
            return org.pepsoft.worldpainter.layers.Caverns.INSTANCE;
        case "Chasms": // @ts-ignore
            return org.pepsoft.worldpainter.layers.Chasms.INSTANCE;
        case "Deciduous": // @ts-ignore
            return org.pepsoft.worldpainter.layers.DeciduousForest.INSTANCE;
        case "Pines": // @ts-ignore
            return org.pepsoft.worldpainter.layers.PineForest.INSTANCE;
        case "Swamp": // @ts-ignore
            return org.pepsoft.worldpainter.layers.SwampLand.INSTANCE;
        case "Jungle": // @ts-ignore
            return org.pepsoft.worldpainter.layers.Jungle.INSTANCE;
        case "Void": // @ts-ignore
            return org.pepsoft.worldpainter.layers.Void.INSTANCE;
        case "Resources": // @ts-ignore
            return org.pepsoft.worldpainter.layers.Resources.INSTANCE;
        case "ReadOnly": // @ts-ignore
            return org.pepsoft.worldpainter.layers.ReadOnly.INSTANCE;
        default:
            throw new TypeError("unknown/not implemented layer type given: " + layerId);
    }
}
function getTerrainById(terrainId) {
    // @ts-ignore
    return org.pepsoft.worldpainter.Terrain.VALUES[terrainId];
}
//# sourceMappingURL=Operation.js.map