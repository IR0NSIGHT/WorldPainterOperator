export function getTerrainById(terrainId: number): Terrain {
    // @ts-ignore
    let terrain = org.pepsoft.worldpainter.Terrain.VALUES[terrainId];
    return terrain;
  }
  
  
  
export interface Terrain {
    getName(): string;
}