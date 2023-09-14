const fs = require("fs");

// var dataFromFile = readFile(filePath)//данные из файла
function writeToFile(adres, data) {
    fs.writeFileSync(adres, JSON.stringify(data, null, 2), err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });
}
exports.writeToFile = writeToFile;

function readFile(adres) {
    try {
        var fileReader = fs.readFileSync(adres).toString();
        return JSON.parse(fileReader);
    } catch (err) {
        // console.log(err)
        console.log('Ошибка чтения файла');
        return {
            response: {
                items: []
            }
        };
    }
}
exports.readFile = readFile; 

async function writingDefaultFileText(nameFile, t1) {
    //     const defaultFileText = `{
    //     "response": {
    //       "count": 1,
    //       "items": [
    //       ]
    //     }
    //   }`
    fs.access(`${nameFile}`, function (error) {
        if (error) {
            writeToFile(JSON.stringify(t1, null, 2), nameFile);
        } else {
            console.log('Файл на месте');
        }
    });
}

