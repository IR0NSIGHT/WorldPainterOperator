import {ParsingError} from "../FileOperation/Parser";

export const log = (mssg: string): void => console.log(mssg)

export const logError = (error: ParsingError): void => {
    if (Array.isArray(error.mssg)) {
        error.mssg.forEach((a) => log("ERROR: " + a));
        throw Error("logging error!"+error.mssg.toString())
    } else {
        log("ERROR: " + error.mssg);
        throw Error("logging error!"+error)
    }

};
