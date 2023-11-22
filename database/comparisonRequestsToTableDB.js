const sqlite3 = require('sqlite3').verbose();

// открытие БД
let db = new sqlite3.Database('./database/vkDB.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

(async () => console.log(await requestByUserJson('richie.r.dragon','19:23 21.11.2023')))()

async function requestByUserJson(communityId, recordingTime) {//вывод запроса в переменную
    let selectResult = await requestResultSelectJson(communityId, recordingTime)
    return JSON.parse(selectResult[0].jsonFollowersList).response
}

function requestResultSelectJson(communityId, recordingTime) {//запрос строки json выбранного времени
    let sql = `SELECT jsonFollowersList
    FROM communitiesList
    where communityId='${communityId}' and recordingTime='${recordingTime}'`

    return new Promise(
        (resolve, reject) => {
            result =  db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                }
                resolve(rows)
            })
        }
    )
}

