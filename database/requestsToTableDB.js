const sqlite3 = require('sqlite3').verbose();

// открытие БД
let db = new sqlite3.Database('./database/vkDB.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

exports.requestByUser = requestByUser;


(async () => console.log(await requestByUser('412993464')))()

async function requestByUser(telegramId) {//массив для формирования кнопки
    let selectResult = await resultSelect(telegramId)
    let preparation = await preparationData(selectResult)
    closeDatabase()
    return preparation
}

function resultSelect(telegramId) {
    let sql = `SELECT c.title
    FROM usersToCommunities as utc
    left join communities as c
    on utc.communityId=c.communityId
    where utc.telegramId='${telegramId}'`

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

function closeDatabase() {
    db.close()
}

async function preparationData(selectResult) {
    let communitiesList=[]
    for (let i = 0; i < selectResult.length; i++) {
        communitiesList.push(selectResult[i].title)   
    }
    return communitiesList
}

