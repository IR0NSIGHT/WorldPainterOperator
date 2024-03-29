export const getTime = (): number => {
  //@ts-ignore use java internal thingy
  return java.lang.System.currentTimeMillis();
};

export const timer = () => {
  let t = 0;
  return {
    start: () => {
      t = getTime();
    },
    stop: () => {
      return getTime() - t;
    }
  };
};
