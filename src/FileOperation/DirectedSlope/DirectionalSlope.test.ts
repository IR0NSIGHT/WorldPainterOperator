import { isParsingError } from "../Parser";
import {
  DirectionalSlopeFilter,
  parseDirectionalSlopeFilter,
  smallestAngle,
} from "./DirectionalSlopeFilter";
import {
  DirectionSetting,
  parseDirectionSetting,
} from "./ParseDirectionalSlope";

describe("parse directional slope settings from config", () => {
  test("parse single setting", () => {
    const data: any = { slopeDir: { dir: 0, maxOffset: 90 } };

    const parsed = parseDirectionSetting(data.slopeDir);

    expect(isParsingError(parsed)).toBeFalsy();
    expect(parsed).toHaveLength(1);
    const filter = (parsed as DirectionSetting[])[0];
    expect(filter.dir).toEqual(0);
    expect(filter.maxOffset).toEqual(90);
  });

  test("parse single setting as array", () => {
    const data: any = { slopeDir: [{ dir: 0, maxOffset: 90 }] };

    const parsed = parseDirectionSetting(data.slopeDir);

    expect(isParsingError(parsed)).toBeFalsy();
    expect(parsed).toHaveLength(1);
    const filter = (parsed as DirectionSetting[])[0];
    expect(filter.dir).toEqual(0);
    expect(filter.maxOffset).toEqual(90);
  });

  test("parse multiple setting as array", () => {
    const data: any = {
      slopeDir: [
        { dir: 0, maxOffset: 90 },
        { dir: -1, maxOffset: 75 },
        { dir: 3, maxOffset: 180 },
      ],
    };

    const parsed = parseDirectionSetting(data.slopeDir);

    expect(isParsingError(parsed)).toBeFalsy();
    expect(parsed).toHaveLength(3);

    const filter1 = (parsed as DirectionSetting[])[0];
    expect(filter1.dir).toEqual(0);
    expect(filter1.maxOffset).toEqual(90);

    const filter2 = (parsed as DirectionSetting[])[1];
    expect(filter2.dir).toEqual(-1);
    expect(filter2.maxOffset).toEqual(75);

    const filter3 = (parsed as DirectionSetting[])[2];
    expect(filter3.dir).toEqual(3);
    expect(filter3.maxOffset).toEqual(180);
  });
});

describe("parse dir slope filter from config", () => {
  test("parse single filter", () => {
    const data: any = { slopeDir: { dir: 0, maxOffset: 90 } };

    const parsed = parseDirectionalSlopeFilter(data.slopeDir);

    expect(isParsingError(parsed)).toBeFalsy();
    expect(parsed).toHaveLength(1);
    const filter = (parsed as DirectionalSlopeFilter[])[0];
    expect(filter.direction).toEqual(0);
    expect(filter.offset).toEqual(90);
  });

  test("parse single filter as array", () => {
    const data: any = { slopeDir: [{ dir: 0, maxOffset: 90 }] };

    const parsed = parseDirectionalSlopeFilter(data.slopeDir);

    expect(isParsingError(parsed)).toBeFalsy();
    expect(parsed).toHaveLength(1);
    const filter = (parsed as DirectionalSlopeFilter[])[0];
    expect(filter.direction).toEqual(0);
    expect(filter.offset).toEqual(90);
  });
});

describe("smallest angle", () => {
  test("neg = pos offset", () => {
    const dir = 0;
    const off = 15;
    expect(smallestAngle(dir, dir + off)).toEqual(off);
    expect(smallestAngle(dir, dir - off)).toEqual(off);
  });
});
