

import { isOperation } from "./AdvancedOperator";
import { parseJsonFromFile } from "./FileOperation/Parser";
import { Operation, executeOperations } from "./Operation/Operation";
import { assert } from "./assert";

declare function log(mssg: string): void;

const filePath: string = params["file1"];

const opList: Operation[] = parseJsonFromFile(filePath);
opList.forEach((a: Operation) => assert(isOperation(a), "invalid operation"));
log("finished parsing operations, amount: " + opList.length);

executeOperations(opList, dimension);
