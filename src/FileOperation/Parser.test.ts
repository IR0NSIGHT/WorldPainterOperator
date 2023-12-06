import {getLayerById, Terrain} from '../worldpainterApi/worldpainterApi';
import {isParsingError, parseOperations, parseTerrains, ParsingError} from './Parser';
import {parseLayers} from './ParseLayer';
import {GeneralOperation} from '../Operation/Operation';

jest.mock('../log');

jest.mock('../worldpainterApi/worldpainterApi');

describe('parse config', () => {
    test('parse multi entry terrain array', () => {
        const myTerrain = (terrainName: string): Terrain => ({
            getName() {
                return terrainName;
            }
        });

        const getTerrainById = (id: number): Terrain => {
            return myTerrain(id.toString());
        };

        const parsed = parseTerrains([0, 1, 2, 0, 1, 2], getTerrainById);

        expect(parsed).toHaveLength(6);
    });

    test('parse single entry terrain', () => {
        const myTerrain = (terrainName: string): Terrain => ({
            getName() {
                return terrainName;
            }
        });

        const getTerrainById = (id: number): Terrain => {
            return myTerrain(id.toString());
        };

        const parsed = parseTerrains(1, getTerrainById);

        expect(parsed).toHaveLength(1);
    });

    test('parse single entry annotation', () => {
        jest.mock('../log.ts', () => ({
            log: jest.fn()
        }));

        const op = {
            onlyOnLayer: ['Frost', 1]
        };

        const l = parseLayers(op.onlyOnLayer, getLayerById);
        expect(isParsingError(l)).toBeFalsy();

        const jsonString = `
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
    `;

        const parsedOp = parseOperations(jsonString);
        expect(isParsingError(parsedOp)).toBeFalsy();
        const opArr = parsedOp as GeneralOperation[];
        expect(opArr).toHaveLength(1);
        expect(opArr[0].filter).toHaveLength(1);
        //TODO change filter to be able to test what kind of filter is created here. abandon OOP
    });

    test('invalid json input:  "onlyOnLayer": ["Frost"]', () => {
        const jsonString = `
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
        `;

        const parsed = parseOperations(jsonString)
        expect(isParsingError(parsed)).toBeTruthy()
        expect((parsed as ParsingError).mssg[0]).toContain("Frost")
    });

    test('example config for onlyOnLayer', () => {
        const jsonString = `
    {
    "operations": [
        {
            "name": "high ground pines with forest floor", 
            "layer": ["Pines", 7], 
            "terrain": [0, 0, 0, 2, 3, 4], 
            "aboveLevel": 90, 
            "belowLevel": 150, 
            "aboveDegrees": 30, 
            "belowDegrees": 60, 
            "onlyOnTerrain": 0, 
            "onlyOnLayer": [["Frost",-1],["Annotations",0],["Pines",3]]
        }
    ]
}

    `;
        const parsedOp = parseOperations(jsonString);
        expect(isParsingError(parsedOp)).toBeFalsy();
    });

    test("layer with (Z) in name, regression",() => {
        const jsonString = `
        {
  "operations": [
    {
      "name": "small bubble forest",
      "layer": ["Ta - Eurasian Aspen (Z)", 7],
      "onlyOnLayer": ["Mask - Forest", 1],
      "perlin": {
        "seed": 12345678.0,
        "scale": 40.0,
        "amplitude": 1.0,
        "threshold": 0.5,
    "belowDegrees": 30
      }
    }
  ]
}
        `
        const jsonObject = JSON.parse(jsonString);
        const parsedOp = parseOperations(jsonString);
        expect(isParsingError(parsedOp)).toBeTruthy();
        expect((parsedOp as ParsingError).mssg).toContain("could not find custom layer with name: Ta - Eurasian Aspen (Z)")
    })
});
