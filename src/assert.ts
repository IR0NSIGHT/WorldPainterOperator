export const assert = (cond: boolean, mssg?: string): void => {
  //@ts-ignore
  print("Assertion failed" + (mssg ? mssg : ""));
};
