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

const assert = (exp: boolean, mssg?: string) => {
  if (!exp) throw new Error("ASSERTION ERROR" + (mssg ? ": " + mssg : ""));
};

function isOperation(operation: object): operation is OperationInterface {
  let cast: OperationInterface = operation as OperationInterface;
  print(JSON.stringify(cast));
  return cast.name !== undefined;
}

//---------------
interface FilterInterface {
  id: string;
  isInSelection: (x: number, y: number, dimension: any) => boolean;
  not: () => FilterInterface;
}

enum Comparator {
  EQUAL,
  GREATER,
  LESS,
  GREATER_EQUAL,
  LESS_EQUAL,
}

class Filter implements FilterInterface {
  id: string;
  private lastPoint: [number, number] = [-1, -1];
  private lastDecision: boolean = false;
  private inverted: InvertFilter | undefined = undefined;
  isInSelection(x: number, y: number, dimension: any): boolean {
    if (x == this.lastPoint[0] && y == this.lastPoint[1])
      return this.lastDecision;
    else {
      this.lastPoint = [x, y];
      this.lastDecision = this.test(x, y, dimension);
      return this.lastDecision;
    }
  }

  test(x: number, y: number, dimension: any) {
    return false;
  }

  not(): FilterInterface {
    if (this.inverted === undefined) this.inverted = new InvertFilter(this);
    return this.inverted;
  }

  constructor(id: string) {
    this.id = id;
  }
}

class StandardFilter extends Filter {
  aboveLevel: number;
  belowLevel: number;
  aboveDegrees: number;
  belowDegrees: number;
  onlyOnTerrain: Terrain | null;

  test(x: number, y: number, dimension: any): boolean {
    return (
      this.insideLevel(dimension.getHeightAt(x, y)) &&
      this.insideSlope(Math.atan(dimension.getSlope(x, y)) * 57.2957795) && //in grad
      this.onTerrain(dimension.getTerrainAt(x, y))
    );
  }

  private insideLevel(z: number) {
    return (
      (this.aboveLevel === -1 || this.aboveLevel <= z) &&
      (this.belowLevel === -1 || this.belowLevel >= z)
    );
  }

  private insideSlope(slope: number) {
    return (
      (this.aboveDegrees == -1 || this.aboveDegrees < slope) &&
      (this.belowDegrees == -1 || this.belowDegrees > slope)
    );
  }

  private onTerrain(terrain: Terrain) {
    return (
      this.onlyOnTerrain == null ||
      this.onlyOnTerrain.getName() == terrain.getName()
    );
  }

  constructor(
    id: string,
    aboveLevel: number,
    belowLevel: number,
    aboveDegrees: number,
    belowDegrees: number,
    onlyOnTerrain: Terrain | null
  ) {
    super(id);
    this.id = id;
    this.aboveLevel = aboveLevel;
    this.belowLevel = belowLevel;
    this.aboveDegrees = aboveDegrees; //Math.tan(aboveLevel/57.3)
    this.belowDegrees = belowDegrees; //Math.tan(belowDegrees/57.3)

    this.onlyOnTerrain = onlyOnTerrain;
  }
}

class RandomFilter extends Filter {
  chance: number;
  test(x: number, y: number, dimension: any): boolean {
    let point = Math.random() * 100;
    return point < this.chance;
  }

  constructor(chance: number) {
    super("random_" + chance);
    this.chance = chance;
  }
}

class PerlinFilter extends Filter {
  perlinNoise: any;
  size: number;
  threshold: number;
  amplitude: number;

  test(x: number, y: number, dimension: any): boolean {
    return this.getValueAt(x, y) > 0;
  }

  private getValueAt(x: number, y: number): number {
    return (
      this.amplitude *
      (this.perlinNoise.getPerlinNoise(x / this.size, y / this.size) +
        (this.threshold - 0.5))
    );
  }

  constructor(
    seed: number,
    size: number,
    threshold: number,
    amplitude: number
  ) {
    super("perlin");
    // @ts-ignore
    this.perlinNoise = new org.pepsoft.util.PerlinNoise(seed);
    this.size = size;
    this.threshold = threshold;
    this.amplitude = amplitude;
  }
}

class InvertFilter extends Filter {
  filter: FilterInterface;
  isInSelection(x: number, y: number, dimension: any): boolean {
    return !this.filter.isInSelection(x, y, dimension);
  }
  constructor(filter: FilterInterface) {
    super("!" + filter.id);
    this.filter = filter;
  }
  not() {
    return this.filter;
  }
}

function getLayerById(layerId: string): Layer {
  print("find layer for id=" + layerId);
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

    case "Annotations": // @ts-ignore
      return org.pepsoft.worldpainter.layers.Annotations.INSTANCE;
    default:
      throw new TypeError(
        "unknown/not implemented layer type given: " + layerId
      );
  }
}

class LayerFilter extends Filter {
  layer: Layer;
  layerValue: number;
  comparator: Comparator;

  /**
   * passes if layerValue at coord is greater(or other comparator) than layerValue in filter
   * @param layer
   * @param layerValue
   * @param comparator
   */
  constructor(layer: Layer, layerValue: number, comparator?: Comparator) {
    super("layer_" + layer.getName());
    this.layer = layer;
    this.layerValue = layerValue;
    if (comparator === undefined) comparator = Comparator.EQUAL;
    this.comparator = comparator;
  }

  test(x: number, y: number, dimension: any): boolean {
    switch (this.comparator) {
      case Comparator.EQUAL:
        return dimension.getLayerValueAt(this.layer, x, y) == this.layerValue;

      case Comparator.GREATER:
        return dimension.getLayerValueAt(this.layer, x, y) > this.layerValue;

      case Comparator.LESS:
        return dimension.getLayerValueAt(this.layer, x, y) < this.layerValue;

      case Comparator.LESS_EQUAL:
        return dimension.getLayerValueAt(this.layer, x, y) <= this.layerValue;

      case Comparator.GREATER_EQUAL:
        return dimension.getLayerValueAt(this.layer, x, y) >= this.layerValue;

      default:
        throw new TypeError("invalid comparator");
    }
  }
}

function getNewFilter(
  id: string,
  aboveLevel: number | null,
  belowLevel: number | null,
  aboveDegrees: number | null,
  belowDegrees: number | null,
  onlyOnTerrain: number | null
) {
  return new StandardFilter(
    id,
    aboveLevel || aboveLevel == 0 ? aboveLevel : -1,
    belowLevel || belowLevel == 0 ? belowLevel : -1,
    aboveDegrees || aboveDegrees == 0 ? aboveDegrees : -1,
    belowDegrees || belowDegrees == 0 ? belowDegrees : -1,
    onlyOnTerrain || onlyOnTerrain === 0 ? getTerrainById(onlyOnTerrain) : null
  );
}

function getTerrainById(terrainId: number): Terrain {
  // @ts-ignore
  let terrain = org.pepsoft.worldpainter.Terrain.VALUES[terrainId];
  return terrain;
}

//interfaces
interface OperationInterface {
  name: string;
  type: OperationType;
  onFilters: FilterInterface[];
  description(): string;

  /**
   * execute operation on this coordinate. will test filters and on pass, apply the operation.
   * @param x
   * @param y
   * @param dimension
   */
  execute(x: number, y: number, dimension: any): void;

  /**
   * apply the operation (without any tests or filtering) on this coordinate.
   * @param x
   * @param y
   * @param dimension
   */
  apply(x: number, y: number, dimension: any): void;

  /**
   * test if this coordinate passes all given filters.
   * @param x
   * @param y
   * @param dimension
   */
  passFilter(x: number, y: number, dimension: any): boolean;
}

interface Terrain {
  getName(): string;
}

enum OperationType {
  applyTerrain = "terrain",
  setLayer = "layer",
}

class Operation implements OperationInterface {
  name: string;
  onFilters: FilterInterface[];
  type!: OperationType;

  constructor(name: string, onFilters: FilterInterface[]) {
    this.name = name;
    this.onFilters = onFilters;
    print("new Operation: " + name);
    onFilters.forEach((a: FilterInterface) => print("filter id=" + a.id));
  }

  execute(x: number, y: number, dimension: any): void {
    if (this.passFilter(x, y, dimension)) this.apply(x, y, dimension);
  }

  passFilter(x: number, y: number, dimension: any) {
    for (let f of this.onFilters) {
      //TODO allow complex forms: (A&B&C)||(D&E&!F) for filter combination
      if (!f.isInSelection(x, y, dimension)) return false;
    }
    return true;
  }

  apply(x: number, y: number, dimension: any): void {}

  description(): string {
    return "GenericOperation";
  }
}
interface Layer {
  getName(): string;
  getId(): string;
}

class LayerOperation extends Operation {
  layerValue: number;
  layer: Layer;

  constructor(
    name: string,
    layer: Layer,
    layerValue: number,
    onFilters: FilterInterface[]
  ) {
    super(name, onFilters);
    this.layer = layer;
    this.layerValue = layerValue;
    this.type = OperationType.setLayer;
  }

  apply(x: number, y: number, dimension: any): void {
    //FIXME breaks for BIT_PER_CHUNK layers like frost, throws illegal arg exception
    dimension.setLayerValueAt(this.layer, x, y, this.layerValue);
  }

  description(): string {
    return (
      this.name +
      "\n\t[set layer => " +
      this.layer?.getName() +
      ":" +
      this.layerValue +
      "]"
    );
  }
}

class TerrainOperation extends Operation {
  private readonly terrain: Terrain | null;

  constructor(name: string, terrain: Terrain, onFilters: FilterInterface[]) {
    super(name, onFilters);
    this.terrain = terrain;
    this.type = OperationType.applyTerrain;
  }

  apply(x: number, y: number, dimension: any) {
    dimension.setTerrainAt(x, y, this.terrain);
  }

  description(): string {
    return this.name + "\n\t[set terrain => " + this.terrain?.getName() + "]";
  }
}

function fillWithValues() {}

type configOperationHead = { type: string; name: string };
type terrainConfigOperation = { terrain: number } & configOperation;
type layerConfigOperation = {
  layerType: string;
  layerValue: number;
} & configOperation;

type configFilter = {
  aboveLevel: number;
  belowLevel: number;
  aboveDegrees: number;
  belowDegrees: number;
  onlyOnTerrain: number;
};
type configOperation = configOperationHead & configFilter;

function parseJsonFromFile(filePath: string): Array<OperationInterface> {
  // @ts-ignore
  var path = java.nio.file.Paths.get(filePath);
  // @ts-ignore
  var bytes = java.nio.file.Files.readAllBytes(path);
  // @ts-ignore
  let jsonString: string = new java.lang.String(bytes);
  jsonString = jsonString.replace(/ *\([^)]*\) */g, ""); //remove "(a comment)"
  let out: any = JSON.parse(jsonString);
  let opList: OperationInterface[] = [];
  let id = 0;
  const nextFilterId = () => {
    id++;
    return id;
  };

  // @ts-ignore
  var op: configOperation;
  assert(out.operations);
  //TODO parse shape of object, assert it has all required fields
  for (op of out.operations) {
    assert(isOperation(op));
    print("parsed object of op: " + JSON.stringify(op));
    let tOp: OperationInterface;

    switch (op.type) {
      case OperationType.applyTerrain: {
        const terrainOp: terrainConfigOperation = op as terrainConfigOperation;
        if (terrainOp.name && (terrainOp.terrain || terrainOp.terrain === 0))
          tOp = new TerrainOperation(
            terrainOp.name,
            getTerrainById(terrainOp.terrain),
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
        else
          print(
            "could not construct operation, illegal null value: " +
              JSON.stringify(op)
          );
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
          print("using layer: " + javaLayer);
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
          print(
            "could not construct operation, illegal null value: " +
              JSON.stringify(op)
          );
        break;
      }
      default: {
        print(
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
      print("add valid op:\n" + JSON.stringify(tOp));
    }
  }
  return opList;
}

/**
 * apply operations as defined in object
 * @param {object} obj
 */
function applyAllOperations(opList: OperationInterface[]) {
  for (var i = 0; i < opList.length; i++) {
    opList[i].execute(1, 2, 3);
  }
}

function executeOperations(ops: OperationInterface[], dimension: any) {
  print("exectue all operations:");
  for (let op of ops) {
    print(op.description());
    for (let f of op.onFilters) {
      print("\tFilter: " + f.id);
    }
  }
  const startX: number = dimension.getLowestX() * 128;
  const startY: number = dimension.getLowestY() * 128;
  const endX: number = startX + dimension.getWidth() * 128;
  const endY: number = startY + dimension.getHeight() * 128;
  let x,
    y: number = 0;
  for (x = startX; x < endX; x++) {
    for (y = startY; y < endY; y++) {
      for (let op of ops) {
        op.execute(x, y, dimension);
      }
    }
  }
}

const filePath: string = params["file1"];

let opList: Operation[] = parseJsonFromFile(filePath);
opList.forEach((a: Operation) => assert(isOperation(a)));
print("finished parsing operations, amount: " + opList.length);

//@ts-ignore
executeOperations(opList, dimension);
