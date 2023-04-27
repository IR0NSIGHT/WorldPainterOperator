declare function print(mssg: string): void;

export const log = (mssg: string): void => print(mssg);

export const logError = (mssg: string): void => log("ERROR: " + mssg);
