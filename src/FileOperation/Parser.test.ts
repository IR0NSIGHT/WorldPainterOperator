import {getLayerById, WorldpainterApi} from "../worldpainterApi/worldpainterApi";
import {isParsingError, parseOperations, parseTerrains} from "./Parser";
import {parseLayers} from "./ParseLayer";
import {Layer} from "../Layer/Layer";
import {GeneralOperation} from "../Operation/Operation";

jest.mock('../log')

jest.mock('../WorldpainterApi/WorldpainterApi');

describe("parse config", () => {
  test("parse multi entry terrain array", () => {
    const myTerrain = (terrainName: string): WorldpainterApi => ({
      getName() {
        return terrainName;
      },
    });

    const getTerrainById = (id: number): WorldpainterApi => {
      return myTerrain(id.toString());
    };

    const parsed = parseTerrains([0, 1, 2, 0, 1, 2], getTerrainById);

    expect(parsed).toHaveLength(6);
  });

  test("parse single entry terrain", () => {
    const myTerrain = (terrainName: string): WorldpainterApi => ({
      getName() {
        return terrainName;
      },
    });

    const getTerrainById = (id: number): WorldpainterApi => {
      return myTerrain(id.toString());
    };

    const parsed = parseTerrains(1, getTerrainById);

    expect(parsed).toHaveLength(1);
  });

  test("parse single entry annotation", () => {
    jest.mock('../log.ts', () => ({
      log: jest.fn(),
    }));

    const op = {
      onlyOnLayer: ["Frost", 1]
    };

    const l = parseLayers(op.onlyOnLayer, getLayerById);
    expect(isParsingError(l)).toBeFalsy();

    const jsonString: string = `
    {
      "operations": [
        {
          "name": "Grass 1",
          "terrain": [0],
          "aboveLevel": -64,
          "belowLevel": 200,
          "aboveDegrees": 0,
          "onlyOnLayer": ["Frost",1]
        }
      ]
    }
    `

    const parsedOp = parseOperations(jsonString)
    expect(isParsingError(parsedOp)).toBeFalsy();
    const opArr = (parsedOp as GeneralOperation[]);
    expect(opArr).toHaveLength(1)
    expect(opArr[0].filter).toHaveLength(1)
    //TODO change filter to be able to test what kind of filter is created here. abandon OOP



  });

  test("invalid json input:  \"onlyOnLayer\": [\"Frost\"]", ()=> {
    const jsonString: string = `
    {
      "operations": [
        {
          "name": "Grass 1",
          "terrain": [0],
          "aboveLevel": -64,
          "belowLevel": 200,
          "aboveDegrees": 0,
          "onlyOnLayer": ["Frost"]
        }
      ]
    }
    `
    expect(() => parseOperations(jsonString)).toThrow("logging error!can not parse layer(s): Frost")
  })

});
