import {ParsingError, isParsingError, parseOperations} from './FileOperation/Parser';
import {GeneralOperation, executeOperations} from './Operation/Operation';
import {logToConsole, logError, logPath, logAll, logToFile} from './log';
import {timer} from "./Timer";
import {loadConfig} from "./FileOperation/FileIO";

logToConsole("your operations log is available in " + logPath + "!")
logToFile("RUNNING ADVANCED OPERATOR by IR0NSI############################")

const filePath: string = params['config'];

const loadedConfigString = loadConfig(filePath);
if (isParsingError(loadedConfigString)) {
    logError(loadedConfigString)
} else {
    logToFile("Used config:\n"+loadedConfigString)
    const opList: GeneralOperation[] | ParsingError = parseOperations(loadedConfigString);
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

}



