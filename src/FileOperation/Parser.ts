import { isOperation } from "../AdvancedOperator";
import { getNewFilter } from "../Filter/Filter";
import { Layer, getLayerById } from "../Layer/Layer";
import { TerrainOperation, LayerOperation } from "../Operation/Operation";
import { OperationInterface, OperationType } from "../Operation/OperationInterface";
import { getTerrainById } from "../Terrain/Terrain";
import { assert } from "../assert";
import { log } from "../log";
import { terrainConfigOperation, layerConfigOperation, configOperation } from "./ConfigOperation";

type ParsingError = { mssg: string }

const parseTerrainOp = (configOp: terrainConfigOperation): TerrainOperation | ParsingError => {
  //check all required fields are present
  if (!(configOp.name && (configOp.terrain || configOp.terrain === 0)))
    return { mssg: "required field is not present." };

  const tOp: TerrainOperation = new TerrainOperation(
    configOp.name,
    getTerrainById(configOp.terrain),
    [
      getNewFilter(
        JSON.stringify("TO BE DONE OWO"),
        configOp.aboveLevel,
        configOp.belowLevel,
        configOp.aboveDegrees,
        configOp.belowDegrees,
        configOp.onlyOnTerrain
      ),
    ]
  );
  return tOp;
}

export function parseJsonFromFile(filePath: string): Array<OperationInterface> {
  // @ts-ignore java object
  const path = java.nio.file.Paths.get(filePath);
  // @ts-ignore java object
  const bytes = java.nio.file.Files.readAllBytes(path);
  // @ts-ignore java object
  let jsonString: string = new java.lang.String(bytes);
  jsonString = jsonString.replace(/ *\([^)]*\) */g, ""); //remove "(a comment)"
  const out: any = JSON.parse(jsonString);
  const opList: OperationInterface[] = [];
  let id = 0;
  const nextFilterId = () => {
    id++;
    return id;
  };

  let op: configOperation;
  assert(out.operations);
  //TODO parse shape of object, assert it has all required fields
  for (op of out.operations) {
    assert(isOperation(op));
    log("parsed object of op: " + JSON.stringify(op));
    let tOp: OperationInterface | null = null;

    switch (op.type) {
      case OperationType.applyTerrain: {
        const terrainOp: terrainConfigOperation = op as terrainConfigOperation;
        const parsedOpOrError = parseTerrainOp(terrainOp);
        if (parsedOpOrError instanceof TerrainOperation)
          tOp = parsedOpOrError
        else
          log(parsedOpOrError.mssg);
        break;
      }
      case OperationType.setLayer: {
        const layerOp: layerConfigOperation = op as layerConfigOperation;
        if (
          layerOp.name &&
          layerOp.layerType &&
          (layerOp.layerValue || layerOp.layerValue === 0)
        ) {
          const javaLayer: Layer = getLayerById(layerOp.layerType);
          assert(javaLayer != undefined, "layer is undefined");
          log("using layer: " + javaLayer);
          tOp = new LayerOperation(
            layerOp.name,
            javaLayer,
            layerOp.layerValue,
            [
              getNewFilter(
                JSON.stringify(nextFilterId()),
                op.aboveLevel,
                op.belowLevel,
                op.aboveDegrees,
                op.belowDegrees,
                op.onlyOnTerrain
              ),
            ]
          );
        } else
          log(
            "could not construct operation, illegal null value: " +
            JSON.stringify(op)
          );
        break;
      }
      default: {
        log(
          "ERROR unknown operation type: '" +
          op.type +
          "' in Operation " +
          op.name
        );
        continue;
      }
    }
    if (tOp) {
      opList.push(tOp);
      log("add valid op:\n" + JSON.stringify(tOp));
    }
  }
  return opList;
}