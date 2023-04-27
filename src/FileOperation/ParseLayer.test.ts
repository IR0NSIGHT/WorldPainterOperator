import { Layer } from "../Layer/Layer";
import { ConfigLayer, LayerSetting, parseLayers } from "./ParseLayer";
import { isParsingError } from "./Parser";

describe("parse layers from config", () => {
  test("parse single entry layer", () => {
    const data: ConfigLayer = ["Frost", 1];

    const getLayerById = (id: string): Layer => {
      return {
        getName() {
          return "name_" + id;
        },
        getId() {
          return id;
        },
      };
    };
    expect(Array.isArray(data)).toBeFalsy;
    const parsed = parseLayers(data, getLayerById);

    expect(parsed).toHaveLength(1);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as LayerSetting[])[0].layer.getId()).toBe("Frost");
    expect((parsed as LayerSetting[])[0].layer.getName()).toBe("name_Frost");
    expect((parsed as LayerSetting[])[0].value).toBe(1);
  });

  test("parse multiple layers", () => {
    const data: ConfigLayer[] = [
      ["Annotations", 5],
      ["Pines", 6],
      ["Frost", 1],
    ];

    const getLayerById = (id: string): Layer => {
      return {
        getName() {
          return id;
        },
        getId() {
          return id;
        },
      };
    };
    expect(Array.isArray(data)).toBeFalsy;
    const parsed = parseLayers(data, getLayerById);

    expect(parsed).toHaveLength(3);
  });

  test("parse undefined value", () => {
    const data: any = { name: "myOperation", terrain: [1, 2, 3] };

    const getLayerById = (id: string): Layer => {
      return {
        getName() {
          return id;
        },
        getId() {
          return id;
        },
      };
    };

    const parsed = parseLayers(data.layer, getLayerById);

    expect(parsed).toHaveLength(0);
    expect(parsed).toMatchObject([]); //empty array
  });

  test("parse mangeled config", () => {
    const data: any = { name: "myOperation", terrain: [1, 2, 3] };

    const getLayerById = (id: string): Layer => {
      return {
        getName() {
          return id;
        },
        getId() {
          return id;
        },
      };
    };

    const parsed = parseLayers(data, getLayerById);
    expect(isParsingError(parsed)).toBeTruthy();
  });
});
