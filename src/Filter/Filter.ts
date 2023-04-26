import { Layer } from "../Layer/Layer";
import { Terrain, getTerrainById } from "../Terrain/Terrain";
import { Comparator, FilterInterface } from "./FilterInterface";

class Filter implements FilterInterface {
    id: string;
    private lastPoint: [number, number] = [-1, -1];
    private lastDecision = false;
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

    test(_x: number, _y: number, _dimension: any) {
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

export class StandardFilter extends Filter {
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

export class RandomFilter extends Filter {
    chance: number;
    test(_x: number, _y: number, _dimension: any): boolean {
        const point = Math.random() * 100;
        return point < this.chance;
    }

    constructor(chance: number) {
        super("random_" + chance);
        this.chance = chance;
    }
}

export class PerlinFilter extends Filter {
    perlinNoise: any;
    size: number;
    threshold: number;
    amplitude: number;

    test(x: number, y: number, _dimension: any): boolean {
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
        // @ts-ignore java object provided by WP
        this.perlinNoise = new org.pepsoft.util.PerlinNoise(seed);
        this.size = size;
        this.threshold = threshold;
        this.amplitude = amplitude;
    }
}

export class InvertFilter extends Filter {
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

export class LayerFilter extends Filter {
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
  
  export function getNewFilter(
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
