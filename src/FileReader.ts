import { isOperation } from "./AdvancedOperator"

function isValidApply(op: object):boolean {
    let out: boolean = (typeof op == "object") && op.hasOwnProperty("type")
    return out
}

function getTerrainByIdx(terrain_idx: number):string {
    // @ts-ignore
    return org.pepsoft.worldpainter.Terrain.values()[terrain_idx].getName()
}


export function parseJsonFromFile(filePath: string): Array<OperationInterface> {
    // @ts-ignore
    var path = java.nio.file.Paths.get(filePath)
    // @ts-ignore
    var bytes = java.nio.file.Files.readAllBytes(path)
    // @ts-ignore
    let jsonString: string = new java.lang.String(bytes)
    jsonString = jsonString.replace(/ *\([^)]*\) */g, ""); //remove "(a comment)"
    let out: object = JSON.parse(jsonString)
    let opList: OperationInterface[] = []
    // @ts-ignore
    for (var op: string of out.operations) {
        assert(isOperation(op))
        let tOp: OperationInterface;
        switch (op.type) {
            case OperationType.applyTerrain: {
                tOp = new TerrainOperation(op.name, op.layer,op.layerValue)
                break;
            }
            case OperationType.setLayer: {
                print("ERROR operation type not yet added: " + OperationType.setLayer)
                tOp = new LayerOperation(
                    op.name,
                    op.layer,
                    op.layerValue,
                    op.angle,
                )
                break;
            }
            default: {
                print("ERROR invalid operation type: '"+ op.type + "' in Operation " + op.name)
                continue;
            }
        }
        opList.push(tOp)
    }
    return opList;
}

/**
 * apply operations as defined in object
 * @param {object} obj
 */
export function applyAllOperations(opList: OperationInterface[]) {
    for (var i = 0; i < opList.length; i++) {
        opList[i].execute(1,2,3)
    }
}

function getTerrainIdxForCustom(index: number) {
    return (index < 48)
        ? ((index < 24) ? index + 47 : index + 52)
        : index + 54;
}
