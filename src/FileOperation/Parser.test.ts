import { Terrain } from "../Terrain/Terrain";
import { parseTerrains } from "./Parser";

describe("parse config", () => {
  test("parse multi entry terrain array", () => {
    const myTerrain = (terrainName: string): Terrain => ({
      getName() {
        return terrainName;
      },
    });

    const getTerrainById = (id: number): Terrain => {
      return myTerrain(id.toString());
    };

    const parsed = parseTerrains([0, 1, 2, 0, 1, 2], getTerrainById);

    expect(parsed).toHaveLength(6);
  });

  test("parse single entry terrain", () => {
    const myTerrain = (terrainName: string): Terrain => ({
      getName() {
        return terrainName;
      },
    });

    const getTerrainById = (id: number): Terrain => {
      return myTerrain(id.toString());
    };

    const parsed = parseTerrains(1, getTerrainById);

    expect(parsed).toHaveLength(1);
  });
});
