
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
