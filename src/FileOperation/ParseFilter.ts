export const safeParseNumber = (n: any): number => {
  if (typeof n !== "number") return -1;
  return n;
};
