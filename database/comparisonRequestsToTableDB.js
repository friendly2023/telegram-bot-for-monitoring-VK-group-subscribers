const sqlite3 = require('sqlite3').verbose();
const communitiesUtils = require('../bot_VK_get/bot.js');

// открытие БД
let db = new sqlite3.Database('./database/vkDB.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

(async () => console.log(await comparisonCommunitiesByTime('richie.r.dragon', '19:23 21.11.2023')))()

async function comparisonCommunitiesByTime(communityId, recordingTime) {
    let oldData = await requestByUserJson(communityId, recordingTime);
    let oldDataID = JSON.parse(oldData).response.items.map(item => item.id)
    let newData = await communitiesUtils.getNewGroupMembersData(communityId);
    let newDataID = JSON.parse(newData).response.items.map(item => item.id)
    return newDataID
}


// (async () => console.log(await requestByUserJson('richie.r.dragon', '19:23 21.11.2023')))()

async function requestByUserJson(communityId, recordingTime) {//вывод запроса в переменную
    let selectResult = await requestResultSelectJson(communityId, recordingTime)
    return selectResult[0].jsonFollowersList
}

function requestResultSelectJson(communityId, recordingTime) {//запрос строки json выбранного времени
    let sql = `SELECT jsonFollowersList
    FROM communitiesList
    where communityId='${communityId}' and recordingTime='${recordingTime}'`

    return new Promise(
        (resolve, reject) => {
            result = db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                }
                resolve(rows)
            })
        }
    )
}

