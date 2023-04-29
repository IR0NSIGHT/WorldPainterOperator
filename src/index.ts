import { parseJsonFromFile } from "./FileOperation/Parser";
import { GeneralOperation, executeOperations } from "./Operation/Operation";
import { log } from "./log";

const filePath: string = params["config"];

const opList: GeneralOperation[] = parseJsonFromFile(filePath);
log("finished parsing " + opList.length + " operations:");
log("execute");
executeOperations(opList, dimension);
