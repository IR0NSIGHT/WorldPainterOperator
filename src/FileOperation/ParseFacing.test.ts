import { Facing, parseFacing } from "./ParseFacing";
import { isParsingError } from "./Parser";

describe("parse single facing from config", () => {
  test("parse 'N'", () => {
    const facingJson = "N";
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeTruthy();
    expect((parsed as Facing).south).toBeFalsy();
    expect((parsed as Facing).east).toBeFalsy();
    expect((parsed as Facing).west).toBeFalsy();
  });

  test("parse 'n'", () => {
    const facingJson = "n";
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeTruthy();
    expect((parsed as Facing).south).toBeFalsy();
    expect((parsed as Facing).east).toBeFalsy();
    expect((parsed as Facing).west).toBeFalsy();
  });

  test("parse 'S'", () => {
    const facingJson = "S";
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeFalsy();
    expect((parsed as Facing).south).toBeTruthy();
    expect((parsed as Facing).east).toBeFalsy();
    expect((parsed as Facing).west).toBeFalsy();
  });

  test("parse 's'", () => {
    const facingJson = "s";
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeFalsy();
    expect((parsed as Facing).south).toBeTruthy();
    expect((parsed as Facing).east).toBeFalsy();
    expect((parsed as Facing).west).toBeFalsy();
  });

  test("parse 'E'", () => {
    const facingJson = "E";
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeFalsy();
    expect((parsed as Facing).south).toBeFalsy();
    expect((parsed as Facing).east).toBeTruthy();
    expect((parsed as Facing).west).toBeFalsy();
  });

  test("parse 'e'", () => {
    const facingJson = "e";
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeFalsy();
    expect((parsed as Facing).south).toBeFalsy();
    expect((parsed as Facing).east).toBeTruthy();
    expect((parsed as Facing).west).toBeFalsy();
  });

  test("parse 'W'", () => {
    const facingJson = "W";
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeFalsy();
    expect((parsed as Facing).south).toBeFalsy();
    expect((parsed as Facing).east).toBeFalsy();
    expect((parsed as Facing).west).toBeTruthy();
  });
  test("parse 'w'", () => {
    const facingJson = "w";
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeFalsy();
    expect((parsed as Facing).south).toBeFalsy();
    expect((parsed as Facing).east).toBeFalsy();
    expect((parsed as Facing).west).toBeTruthy();
  });
});

describe("parse multiple facing from config", () => {
  test("parse 'NSEW'", () => {
    const facingJson = ["N", "S", "E", "W"];
    const ff = parseFacing;
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeTruthy();
    expect((parsed as Facing).south).toBeTruthy();
    expect((parsed as Facing).east).toBeTruthy();
    expect((parsed as Facing).west).toBeTruthy();
  });
  test("parse 'eSE'", () => {
    const facingJson = ["e", "S", "E"];
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeFalsy();
    expect((parsed as Facing).south).toBeTruthy();
    expect((parsed as Facing).east).toBeTruthy();
    expect((parsed as Facing).west).toBeFalsy();
  });
  test("parse empty", () => {
    const facingJson: any = [];
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeFalsy();
    expect((parsed as Facing).south).toBeFalsy();
    expect((parsed as Facing).east).toBeFalsy();
    expect((parsed as Facing).west).toBeFalsy();
  });
  test("parse undefined", () => {
    const facingJson: any = undefined;
    const parsed = parseFacing(facingJson);
    expect(isParsingError(parsed)).toBeFalsy();
    expect((parsed as Facing).north).toBeFalsy();
    expect((parsed as Facing).south).toBeFalsy();
    expect((parsed as Facing).east).toBeFalsy();
    expect((parsed as Facing).west).toBeFalsy();
  });
});
