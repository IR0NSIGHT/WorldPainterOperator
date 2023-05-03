import { ParsingError, isParsingError, parseJsonFromFile } from "./FileOperation/Parser";
import { GeneralOperation, executeOperations } from "./Operation/Operation";
import { log, logError } from "./log";

const filePath: string = params["config"];

const opList: GeneralOperation[]|ParsingError = parseJsonFromFile(filePath);

if (isParsingError(opList)) {
    logError(opList);
} else {
    log("finished parsing " + opList.length + " operations:");
    log("execute operations");
    executeOperations(opList, dimension);
}

