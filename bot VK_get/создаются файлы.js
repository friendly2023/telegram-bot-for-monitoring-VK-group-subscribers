const fs = require('fs');
const groupId = `ostin`;
const nameFile = `Подписчики группы ${groupId}.json`;
const adres = `c:\\Programming Project\\bot VK_get\\${nameFile}`;


writingDefaultFileText(nameFile)

function writingDefaultFileText(nameFile) {
    const defaultFileText = `{
    "response": {
      "count": 1,
      "items": [
      ]
    }
  }`
    fs.access(`${adres}`, function (error) {
        if (error) {
            //создает файл и записывает в него text
            fs.appendFile(`${adres}`, `${defaultFileText}`, (err) => {
                if (err) throw err;
            })

        }
    });
}
