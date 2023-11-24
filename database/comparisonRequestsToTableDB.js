const sqlite3 = require('sqlite3').verbose();
const communitiesUtils = require('../bot_VK_get/bot.js');

// открытие БД
let db = new sqlite3.Database('./database/vkDB.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

// (async () => console.log(await comparisonCommunitiesByTime('richie.r.dragon', '24.11.2023, 16:33:32')))()
exports.comparisonCommunitiesByTime = comparisonCommunitiesByTime;

async function comparisonCommunitiesByTime(communityId, recordingTime) {
    let oldData = await requestByUserJson(communityId, recordingTime);
    let oldDataID = JSON.parse(oldData).response.items.map(item => item.id);
    // console.log(oldDataID)
    let newData = await communitiesUtils.getNewGroupMembersData(communityId);
    let newDataID = JSON.parse(newData).response.items.map(item => item.id)
    // console.log(newDataID)
    let comparison= await comparisonID(oldDataID,newDataID)
    return comparison
}

async function comparisonID(oldDataID,newDataID) {
    let subscribed = newDataID.filter(x => !oldDataID.includes(x));
    let subscrib = await gettingResultsSubscribers(subscribed);
    
    let unSubscribed = oldDataID.filter(x => !newDataID.includes(x));
    let unSubscrib = await gettingResultsNoSubscribers(unSubscribed);
    return `${subscrib};
${unSubscrib};`
}


async function requestByUserJson(communityId, recordingTime) {//вывод запроса в переменную
    let selectResult = await requestResultSelectJson(communityId, recordingTime)
    // console.log(selectResult[0].jsonFollowersList)
    return selectResult[0].jsonFollowersList
}

async function requestResultSelectJson(communityId, recordingTime) {//запрос строки json выбранного времени
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

async function gettingResultsNoSubscribers(noSubscribers) {
    if (noSubscribers.length == 1) {
        return `Отписался: ${noSubscribers}`
    } else if (noSubscribers.length > 1) {
        return `Отписались: ${noSubscribers}`
    } else {
        return 'Новых отписавшихся нет'
    }
}

async function gettingResultsSubscribers(subscribers) {
    if (subscribers.length == 1) {
        return `Подписался: ${subscribers}`
    } else if (subscribers.length > 1) {
        return `Подписались: ${subscribers}`
    } else {
        return 'Новых подписчиков нет'
    }
}