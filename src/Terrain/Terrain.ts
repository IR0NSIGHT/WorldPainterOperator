export function getTerrainById(terrainId: number): Terrain {
    // @ts-ignore worldpainter java object
    const terrain = org.pepsoft.worldpainter.Terrain.VALUES[terrainId];
    return terrain;
  }
   
export interface Terrain {
    getName(): string;
}