import { Dimension } from "../Dimension";
import { Filter } from "./Filter";

type PerlinNoise = { getPerlinNoise: (x: number, y: number) => number };

export class PerlinFilter extends Filter {
  perlinNoise: PerlinNoise;
  scale: number;
  threshold: number;
  amplitude: number;

  test(x: number, y: number, _dimension: Dimension): boolean {
    const pass = this.getValueAt(x, y) > this.threshold;
    return pass;
  }

  private getValueAt(x: number, y: number): number {
    //between 0 and 1
    const perlinValue =
      this.perlinNoise.getPerlinNoise(x / this.scale, y / this.scale) + 0.5;
    return this.amplitude * perlinValue;
  }

  constructor(
    seed: number,
    size: number,
    threshold: number,
    amplitude: number
  ) {
    super("perlin");
    // @ts-ignore   java stuff
    this.perlinNoise = new org.pepsoft.util.PerlinNoise(seed) as PerlinNoise;
    this.scale = size;
    this.threshold = threshold;
    this.amplitude = amplitude;
  }
}
