import { ParsingError } from "./FileOperation/Parser";

declare function print(mssg: string): void;

export const log = (mssg: string): void => print(mssg);

export const logError = (error: ParsingError): void => {
  if (Array.isArray(error.mssg)) {
    error.mssg.forEach((a) => log("ERROR: " + a));
  } else {
    log("ERROR: " + error.mssg);
  }
};
