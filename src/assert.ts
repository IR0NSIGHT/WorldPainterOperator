export const assert = (cond: boolean, mssg?: string): void => {
  //@ts-ignore
  log("Assertion failed" + (mssg ?": "+ mssg : ""));
};
