import {FilterInterface} from "./Filter";

export enum OperationType {
    applyTerrain = "terrain",
    setLayer = "layer"
}
//interfaces
export interface OperationInterface {
    name: string;
    type: OperationType;
    onFilters: FilterInterface[];
    toString():string

    /**
     * execute operation on this coordinate. will test filters and on pass, apply the operation.
     * @param x
     * @param y
     * @param dimension
     */
    execute(x: number, y: number, dimension: any): void

    /**
     * apply the operation (without any tests or filtering) on this coordinate.
     * @param x
     * @param y
     * @param dimension
     */
    apply(x: number, y: number, dimension: any): void

    /**
     * test if this coordinate passes all given filters.
     * @param x
     * @param y
     * @param dimension
     */
    passFilter(x: number, y: number, dimension: any): boolean
}

export interface Layer {
    getName(): string
    getId(): string
}

export function newOperation(name: string, filters: FilterInterface[], type: OperationType, meta: any[]): OperationInterface {
    switch (type) {
        case OperationType.setLayer:
            return new LayerOperation(name, getLayerById(meta[0]), meta[1], filters)

        case OperationType.applyTerrain:
            return new TerrainOperation(name, getTerrainById(meta[0]), filters)

        default: throw new TypeError("unknown operation type")
    }
}

export function executeOperations(ops: OperationInterface[], dimension: any) {
    const startX: number    = dimension.getLowestX()*128;
    const startY: number    = dimension.getLowestY()*128;
    const endX: number      = startX + dimension.getWidth()*128;
    const endY: number      = startY + dimension.getHeight()*128
    let x, y: number = 0;
    for (x = startX; x < endX; x++)
    {
        for (y = startY; y < endY; y++)
        {
            for (let op of ops) {
                op.execute(x,y,dimension)
            }
        }
    }
}

interface Terrain {

}

class Operation implements OperationInterface {
    name: string;
    onFilters: FilterInterface[];
    type: OperationType;

    constructor(name: string, onFilters: FilterInterface[]) {
        this.name = name
        this.onFilters = onFilters;
    }

    execute(x: number, y: number, dimension: any): void {
        if  ( this.passFilter(x, y, dimension))
            this.apply(x,y,dimension)
    }

    passFilter(x: number, y: number, dimension: any) {
        for (let f of this.onFilters) { //TODO allow complex forms: (A&B&C)||(D&E&!F) for filter combination
            if (f.isInSelection(x,y,dimension))
                return true;
        }
    }

    apply(x: number, y: number, dimension: any): void {
    }
}

class LayerOperation extends Operation {
    layerValue: number;
    layer: Layer;

    constructor(name: string, layer: Layer, layerValue: number, onFilters: FilterInterface[]) {
        super(name, onFilters)
        // @ts-ignore
        this.layer = layer
        this.layerValue = layerValue
        this.type = OperationType.setLayer
    }

    apply(x: number, y: number, dimension: any): void {
        dimension.setLayerValueAt(
            this.layer, x, y, this.layerValue
        )
    }

}

class TerrainOperation extends Operation {
    private terrain: Terrain;
    constructor(name: string, terrain: Terrain, onFilters: FilterInterface[]) {
        super(name, onFilters)
        this.terrain = terrain
        this.type = OperationType.applyTerrain
    }

    apply(x: number, y: number, dimension: any) {
        dimension.setTerrainAt(
           x, y, this.terrain
        )
    }
}

function getLayerById(layerId: string): Layer {
    switch (layerId) {
        case "Frost":// @ts-ignore
            return org.pepsoft.worldpainter.layers.Frost.INSTANCE

        case "Caves":// @ts-ignore
            return org.pepsoft.worldpainter.layers.Caves.INSTANCE

        case "Caverns":// @ts-ignore
            return org.pepsoft.worldpainter.layers.Caverns.INSTANCE

        case "Chasms":// @ts-ignore
            return org.pepsoft.worldpainter.layers.Chasms.INSTANCE

        case "Deciduous":// @ts-ignore
            return org.pepsoft.worldpainter.layers.DeciduousForest.INSTANCE

        case "Pines":// @ts-ignore
            return org.pepsoft.worldpainter.layers.PineForest.INSTANCE

        case "Swamp":// @ts-ignore
            return org.pepsoft.worldpainter.layers.SwampLand.INSTANCE

        case "Jungle":// @ts-ignore
            return org.pepsoft.worldpainter.layers.Jungle.INSTANCE

        case "Void":// @ts-ignore
            return org.pepsoft.worldpainter.layers.Void.INSTANCE

        case"Resources":// @ts-ignore
            return org.pepsoft.worldpainter.layers.Resources.INSTANCE

        case "ReadOnly":// @ts-ignore
            return org.pepsoft.worldpainter.layers.ReadOnly.INSTANCE

        default:
            throw new TypeError("unknown/not implemented layer type given: " + layerId)
    }
}

function getTerrainById(terrainId: number): Terrain {
    // @ts-ignore
    return org.pepsoft.worldpainter.Terrain.VALUES[terrainId]
}
