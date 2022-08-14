// script.name=Advanced Operations by IR0NSIGHT
// script.description= executre multiple operations in a row based on a config file.//
// script.param.file1.type=file
// script.param.file1.description=Parameters can be optional
// script.param.file1.optional=true
// script.param.file1.default=C:\Users\Max1M\Documents\Worldpainter\scripts\operations\test.json

declare function print(mssg: string): void;
// @ts-ignore: params supplied by context
const params = params;
// @ts-ignore: wp supplied by context
const wp = wp;
// @ts-ignore: world supplied by context
const world = world;



function isOperation(operation: object): operation is OperationInterface {
    let cast: OperationInterface = (operation as OperationInterface)
    print (JSON.stringify(cast))
    return cast.name !== undefined
}

const filePath: string = params["file1"]
const operations = ["set_terrain","set_layer"]

function assert(condition: boolean, message: string):void {
    if (!condition) {
        throw message || "Assertion failed";
    }
}


function paintAboveDegree(terrain_idx, aboveAngle, layer, layerValue) {
    
    var filter = null; 
    if (layer == null) {
        print("no layer given")
        // @ts-ignore
        filter = wp
        .createFilter()
        .aboveDegrees(aboveAngle) // Optional. Mutuatlly exclusive with aboveDegrees(). Specifies the slope in degrees below which the operation must be applied. PLEASE NOTE: only works well with worlds created from high res (16-bit) height maps or sculpted manually in WorldPainter!
        .go();
    } else {
        print("layer given: " + layer.getName())
        // @ts-ignore
        filter = wp
        .createFilter()
        .aboveDegrees(aboveAngle) // Optional. Mutuatlly exclusive with aboveDegrees(). Specifies the slope in degrees below which the operation must be applied. PLEASE NOTE: only works well with worlds created from high res (16-bit) height maps or sculpted manually in WorldPainter!
        .onlyOnLayer(layer);
        print(layer.dataSize)
        if ((layer.dataSize == "BYTE" || layer.dataSize == "NIBBLE") && layerValue != null)
            // @ts-ignore
            filter.withValue(layerValue);   //TODO withValue crashes for "pine" layer, without doesnt apply to "pine" layer
        // @ts-ignore
        filter = filter.go();
    }
    print("filter = " + filter)
    // @ts-ignore
    wp.applyTerrain(terrain_idx) // The terrain type index to set
    // @ts-ignore
        .toWorld(world) // See "Loading a World" or "Creating a World from a Height Map"
        .withFilter(filter)
        .applyToSurface() // Optional. Mutually exclusive with applyToNether() and applyToEnd(). Indicates that the layer should be applied to the Surface dimension. This is the default
     .go();
     print("set terrain above " + aboveAngle + "deg to "+terrain_idx+ " on layer "+ layer + "="+ layerValue)
}

/**
 * 
 * @param filter returns false for all unwanted blocks
 * @param modify modifies the block
 * @param dimension world.getDimension(0), allows access to anything relevant.
 */
function applyToMap(
    filter: (x: number, y: number, dimension: any) => boolean,
    modify: (x: number, y: number, dimension: any) => void,
    dimension: any) {
    print(""+dimension.getLowestX()*128)
    print(""+dimension.getHighestX()*128)
    print(""+dimension.getLowestY()*128)
    print(""+dimension.getHighestY()*128)
    const startX: number    = dimension.getLowestX()*128;
    const startY: number    = dimension.getLowestY()*128;
    const endX: number      = startX + dimension.getWidth()*128;
    const endY: number      = startY + dimension.getHeight()*128
    print("("+startX+","+startY+") -> ("+endX+","+endY+")")
    var x, y : number = 0
    for (x = startX; x < endX; x++)
    {
        for (y = startY; y < endY; y++)
        {
            if (filter(x,y, dimension)) {
                modify(x,y, dimension)
            }
        }
    }
    print("applied to" + x + "x" + y)
}

//let opList: Operation[] = parseJsonFromFile(filePath)
//applyAllOperations(opList)


// @ts-ignore
const pNoise = new org.pepsoft.util.PerlinNoise(69420)

function betweenSlopes(x: number, y: number, dimension: any): boolean {
    if (dimension.getWaterLevelAt(x, y) > dimension.getIntHeightAt(x, y)) {
        return false;
    }
    let slope: number = Math.atan(dimension.getSlope(x,y))*57.2957795  //in grad
    return (1 < slope && slope < 60)
}

function paintPines(x: number, y: number, dimension: any): void {
    let slope: number = Math.atan(dimension.getSlope(x,y))*57.2957795  //in grad
    let normalized: number = (90-slope)/90
    let pFactor = 48    //blobsize
    let threshold = 0.6;    //average percent above zero
    let amplitude = 30;
    let value = amplitude* (pNoise.getPerlinNoise(x/pFactor,y/pFactor)+(threshold-0.5));
    value = value * (normalized*2)
    value = Math.max(0,Math.min(value,9))

    dimension.setLayerValueAt(        
        // @ts-ignore
        org.pepsoft.worldpainter.layers.PineForest.INSTANCE,
        x,y, value
    )
}

let dim = world.getDimension(0)
applyToMap(betweenSlopes, paintPines, dim)






