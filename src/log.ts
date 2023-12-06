import { ParsingError } from './FileOperation/Parser';
import {appendStringToFile} from "./FileOperation/FileIO";

declare function print(mssg: string): void;
declare const scriptDir: string;

export const logPath = scriptDir + "operator_log.txt"

export const logToConsole = (mssg: string): void => {
  print(mssg)
};

export const logAll = (mssg: string): void => {
  logToConsole(mssg)
  logToFile(mssg)
}

export const logToFile = (mssg: string) => {
  appendStringToFile(logPath, mssg)
}

export const logError = (error: ParsingError): void => {
  var string = "";
  if (Array.isArray(error.mssg)) {
    error.mssg.forEach((a) => string += 'ERROR: ' + a);
  } else {
    string += 'ERROR: ' + error.mssg;
  }

  logToConsole(string)
  logToFile(string)
};

