import { FilterInterface } from "../Filter/FilterInterface";
import { Layer } from "../Layer/Layer";
import { Terrain } from "../Terrain/Terrain";
import { log } from "../log";
import { OperationInterface, OperationType } from "./OperationInterface";

export class Operation implements OperationInterface {
    name: string;
    onFilters: FilterInterface[];
    type!: OperationType;
  
    constructor(name: string, onFilters: FilterInterface[]) {
      this.name = name;
      this.onFilters = onFilters;
      log("new Operation: " + name);
      onFilters.forEach((a: FilterInterface) => log("filter id=" + a.id));
    }
    apply(x: number, y: number, dimension: any): void {
        throw new Error("Method not implemented." +x+y+dimension);  //eslint will complain if the vars are not used
    }
  
    execute(x: number, y: number, dimension: any): void {
      if (this.passFilter(x, y, dimension)) this.apply(x, y, dimension);
    }
  
    passFilter(x: number, y: number, dimension: any) {
      for (const f of this.onFilters) {
        //TODO allow complex forms: (A&B&C)||(D&E&!F) for filter combination
        if (!f.isInSelection(x, y, dimension)) return false;
      }
      return true;
    }
  
  
    description(): string {
      return "GenericOperation";
    }
  }
  
  
  export class LayerOperation extends Operation {
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
  
  export class TerrainOperation extends Operation {
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

  export function executeOperations(ops: OperationInterface[], dimension: any) {
    log("exectue all operations:");
    for (const op of ops) {
      log(op.description());
      for (const f of op.onFilters) {
        log("\tFilter: " + f.id);
      }
    }
    const startX: number = dimension.getLowestX() * 128;
    const startY: number = dimension.getLowestY() * 128;
    const endX: number = startX + dimension.getWidth() * 128;
    const endY: number = startY + dimension.getHeight() * 128;
    let x,
      y = 0;
    for (x = startX; x < endX; x++) {
      for (y = startY; y < endY; y++) {
        for (const op of ops) {
          op.execute(x, y, dimension);
        }
      }
    }
  }
  