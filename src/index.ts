// script.name=Advanced Operations by IR0NSIGHT
// script.description= executre multiple operations in a row based on a config file.//
// script.param.file1.type=file
// script.param.file1.description=Parameters can be optional
// script.param.file1.optional=true
// script.param.file1.default=\AdvancedOperator\Operations\example.json

import {
  Operation,
  executeOperations,
  isOperation,
  parseJsonFromFile,
} from "./AdvancedOperator";
import { assert } from "./assert";

declare function print(mssg: string): void;

const filePath: string = params["file1"];

let opList: Operation[] = parseJsonFromFile(filePath);
opList.forEach((a: Operation) => assert(isOperation(a), "invalid operation"));
print("finished parsing operations, amount: " + opList.length);

executeOperations(opList, dimension);
