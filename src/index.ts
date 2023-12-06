import { ParsingError, isParsingError, parseJsonFromFile } from './FileOperation/Parser';
import { GeneralOperation, executeOperations } from './Operation/Operation';
import {logToConsole, logError, logPath, logAll, logToFile} from './log';
import {timer} from "./Timer";

logToConsole("your operations log is available in " + logPath + "!")
logToFile("RUNNING ADVANCED OPERATOR by IR0NSI############################")

const filePath: string = params['config'];
const opList: GeneralOperation[] | ParsingError = parseJsonFromFile(filePath);
if (isParsingError(opList)) {
  logError(opList);
} else {
  logAll('finished parsing ' + opList.length + ' operations:');
  logAll('execute operations');
  const myTimer = timer();
  myTimer.start();
  executeOperations(opList, dimension);
  logAll('took ' + myTimer.stop() / 1000 + ' seconds total.');
}


