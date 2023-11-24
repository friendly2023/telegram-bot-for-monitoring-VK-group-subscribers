const sqlite3 = require('sqlite3').verbose();

// открытие БД
let db = new sqlite3.Database('./database/vkDB.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

exports.creatingIdArray = creatingIdArray;
exports.creatingTitleArray = creatingTitleArray;
exports.closeDatabase = closeDatabase;
exports.creatingTitleArrayTime=creatingTitleArrayTime;

// (async () => console.log(await creatingTitleArrayTime('richie.r.dragon')))()

async function creatingIdArray(telegramId) {//создание массива id сообществ
    let arrayDataCommunitiesTitleCommunityId = await requestByUser(telegramId)
    let communitiesList=[]
    for (let i = 0; i < arrayDataCommunitiesTitleCommunityId.length; i++) {
        communitiesList.push(arrayDataCommunitiesTitleCommunityId[i].communityId)   
    }
    return communitiesList
}

async function creatingTitleArray(telegramId) {//создание массива названий сообществ
    let arrayDataCommunitiesTitleCommunityId = await requestByUser(telegramId)
    let communitiesList=[]
    for (let i = 0; i < arrayDataCommunitiesTitleCommunityId.length; i++) {
        communitiesList.push(arrayDataCommunitiesTitleCommunityId[i].title)   
    }
    return communitiesList
}

async function requestByUser(telegramId) {//вывод запроса в переменную
    let selectResult = await resultSelect(telegramId)
    //closeDatabase()
    return selectResult
}

function resultSelect(telegramId) {//запрос
    let sql = `SELECT c.title, c.communityId
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

function closeDatabase() {
    console.log('дб закрыта')
    db.close()
}