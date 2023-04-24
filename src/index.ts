

declare function print(mssg: string): void;

//---------------- operations
enum OperationType {
applyTerrain = "terrain",
setLayer = "layer"
}
//interfaces
interface OperationInterface {
    name: string;
    type: OperationType;
    onFilters: FilterInterface[];
    description():string

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

interface Layer {
getName(): string
getId(): string
}

function newOperation(name: string, filters: FilterInterface[], type: OperationType, meta: any[]): OperationInterface {
switch (type) {
    case OperationType.setLayer:
        print("set layer OP")
        assert(meta.length==2)
        return new LayerOperation(name, getLayerById(meta[0]), meta[1], filters)

    case OperationType.applyTerrain:
        print("apply terrain op")
        return new TerrainOperation(name, getTerrainById(meta[0]), filters)

    default: throw new TypeError("unknown operation type")
}
}

function executeOperations(ops: OperationInterface[], dimension: any) {
    for (let op of ops) {
        print(op.description())
        for (let f of op.onFilters) {
            print("\tFilter: " + f.id)
        }
    }
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
    getName(): string
}

class Operation implements OperationInterface {
    name: string;
    onFilters: FilterInterface[];
    type!: OperationType;

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
            if (!f.isInSelection(x,y,dimension))
                return false;
        }
        return true
    }

    apply(x: number, y: number, dimension: any): void {
    }

    description(): string {
        return "GenericOperation";
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

    description(): string {
        return this.name +"\n\t[set layer => "+ this.layer.getName() + ":"+this.layerValue+"]";
    }
}

class TerrainOperation extends Operation {
    private readonly terrain: Terrain;

    constructor(name: string, terrain: Terrain, onFilters: FilterInterface[]) {
        super(name, onFilters)
        this.terrain = terrain
        this.type = OperationType.applyTerrain
        assert(terrain !== undefined)
    }

    apply(x: number, y: number, dimension: any) {
        dimension.setTerrainAt(
            x, y, this.terrain
        )
    }

    description(): string {
        return this.name +"\n\t[set terrain => " + this.terrain.getName()+"]"
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

        case "Annotations":// @ts-ignore
            return org.pepsoft.worldpainter.layers.Annotations.INSTANCE
        default:
            throw new TypeError("unknown/not implemented layer type given: " + layerId)
    }
}



//---------------
interface FilterInterface {
    id: string
    isInSelection: (x: number, y: number, dimension: any)=>boolean
    not: ()=>FilterInterface
}

export enum Comparator {
    EQUAL,
    GREATER,
    LESS,
    GREATER_EQUAL,
    LESS_EQUAL
}

//-------------
//tests
let testF = new Filter("ststst")
assert(testF === testF.not().not())


//-------------
print("running index")
let steepFilter = getNewFilter("steep filter",-1,-1,45,-1,-1)
let ops = [
    newOperation("rock on steep",[steepFilter],OperationType.applyTerrain, [29]),
    newOperation("sprinkle grass on steep",[steepFilter, new RandomFilter(30)],OperationType.applyTerrain, [0])
]
let f
let steep = new StandardFilter("cliff",-1,-1,40,-1,null);
let steepR = new RandomFilter(67)

let annos = getLayerById("Annotations")
let forestNoise = new PerlinFilter(420,100, 0.5, 1)
let forestRand = new PerlinFilter(40,10, 0.5, 1)
ops = [
    newOperation("grass",[],OperationType.applyTerrain, [0]),

    newOperation("steep rock",[steep, steepR], OperationType.applyTerrain, [75]),
    newOperation("steep moss", [steep, steepR.not()], OperationType.applyTerrain,[31]),

    //set tree layers
    newOperation("flat forest",[forestNoise, forestRand], OperationType.setLayer, ["Pines",10]),
    newOperation("flat forest",[steep.not(), forestNoise, forestRand.not()], OperationType.setLayer, ["Deciduous",10]),

    //set forest floor for both tree layers
    newOperation("forest floor",[new LayerFilter(getLayerById("Pines"),0,Comparator.GREATER), new RandomFilter(50)],OperationType.applyTerrain, [4]),
    newOperation("forest floor",[new LayerFilter(getLayerById("Deciduous"),0,Comparator.GREATER), new RandomFilter(50)],OperationType.applyTerrain, [4])

    //newOperation("annotate plains",[steep.not(), forestNoise.not(), new RandomFilter(75)], OperationType.setLayer, ["Annotations",5])

   // newOperation("stone",[new RandomFilter(0).not().not().not()],OperationType.applyTerrain,[29])
]
// @ts-ignore
executeOperations(ops, world.getDimension(0))


