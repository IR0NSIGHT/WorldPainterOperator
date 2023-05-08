import { smallestAngle } from "./DirectionalSlopeFilter";

describe("smallest angle", () => {
  test("neg = pos offset", () => {
    const dir = 0;
    const off = 15;
    expect(smallestAngle(dir, dir + off)).toEqual(off);
    expect(smallestAngle(dir, dir - off)).toEqual(off);
  });
});
