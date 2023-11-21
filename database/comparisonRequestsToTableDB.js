const sqlite3 = require('sqlite3').verbose();

// открытие БД
let db = new sqlite3.Database('./database/vkDB.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

(async () => console.log(await creatingTitleArrayTime('richie.r.dragon')))()

async function creatingTitleArrayTime(communityId) {//создание массива времени записи сообществ
    let timeCommunityId = await requestByUserTime(communityId)
    let communitiesList=[]
    for (let i = 0; i < timeCommunityId.length; i++) {
        communitiesList.push(timeCommunityId[i].recordingTime)   
    }
    return communitiesList
}

async function requestByUserTime(communityId) {//вывод запроса в переменную
    let selectResult = await resultSelectTime(communityId)
    return selectResult
}

function resultSelectTime(communityId) {//запрос
    let sql = `SELECT *
    FROM communitiesList
    where communityId='${communityId}'`

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