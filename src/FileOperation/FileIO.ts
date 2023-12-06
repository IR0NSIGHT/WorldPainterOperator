import {ParsingError} from "./Parser";

export function loadConfig(filePath: string): string | ParsingError {
    let bytes;
    try {
        // @ts-ignore java object
        const path = java.nio.file.Paths.get(filePath);
        // @ts-ignore java object
        bytes = java.nio.file.Files.readAllBytes(path);
    } catch (e) {
        return {mssg: 'Could not find or load file from:' + filePath};
    }

    try {
        // @ts-ignore java object
        let jsonString: string = new java.lang.String(bytes);
        jsonString = jsonString.replace(/#.*#/g, ''); //remove "(a comment)" //TODO json with comments format
        return jsonString;
    } catch (e) {
        return {
            mssg: 'could not parse JSON object from config file, please check JSON syntax'
        };
    }
}

declare var java : any;
export const writeFile = (filePath: String, content: String) => {
    try {
        const file = new java.io.File(filePath);
        const writer = new java.io.PrintWriter(file);
        writer.print(content);
        writer.close();
        return { mssg: 'File successfully written: ' + filePath };
    } catch (e) {
        return { mssg: 'Error writing file: ' + e };
    }
}

export function appendStringToFile(filePath: string, content: string): { error: boolean, mssg: string } {
    try {
        const dateFormat = new java.text.SimpleDateFormat('yyyy-MM-dd HH:mm:ss');
        const currentTime = new java.util.Date();
        const formattedTime = dateFormat.format(currentTime);


        const file = new java.io.File(filePath);
        const fileWriter = new java.io.FileWriter(file, true); // 'true' for append mode
        const writer = new java.io.PrintWriter(fileWriter);
        writer.println(formattedTime+":\t"+content);
        writer.close();
        return { error: false, mssg: 'Content appended to file: ' + filePath };
    } catch (e) {
        return { error: true, mssg: 'Error appending to file: ' + e };
    }
}
