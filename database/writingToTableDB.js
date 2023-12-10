const sqlite3 = require('sqlite3').verbose();
const communitiesUtils = require('../bot_VK_get/bot.js');
const comparisonRequestsToTableDB = require('./comparisonRequestsToTableDB.js');

exports.writeToFileSQL = writeToFileSQL;

let db = new sqlite3.Database('./database/vkDB.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

// (async () => console.log(await writeToFileSQL('412993464', 'Friendly', 'repostgod')))()
// (async () => console.log(await comparisonCommunitySubscribers('repostgod')))()

async function writeToFileSQL(telegramId, firstName, communityId) {
  let newDataGroup = await communitiesUtils.getNewGroupMembersData(communityId);
  // console.log(newDataGroup.slice(0, 21))
  if (newDataGroup.slice(0, 21) == `{"response":{"count":`) {
    let newNameGroup = await communitiesUtils.getCommunityName(communityId);
    //console.log(newNameGroup)
    let dataInSQL = await writeToSQL(telegramId, firstName, newDataGroup, newNameGroup, communityId);
    return `Данные  по сообществу "${newNameGroup}" добавлены/обновлены`
  } else {
    return `Сообщества по предложенной ссылке не существует, проверте правильность написания`
  }
}

async function writeToSQL(telegramId, firstName, jsonFollowersList, title, communityId) {
    let check= await comparisonCommunitySubscribers(communityId);
  db.serialize(() => {

    db.run(`INSERT INTO users (telegramId, firstName)
            VALUES ('${telegramId}', '${firstName}')
            ON CONFLICT(telegramId) DO UPDATE SET
            firstName='${firstName}';`)

    db.run(`INSERT INTO communities (communityId, title)
            VALUES ('${communityId}', '${title}')
            ON CONFLICT(communityId) DO UPDATE SET
            title='${title}';`)

    db.run(`INSERT INTO usersToCommunities(telegramId, communityId)
            VALUES ('${telegramId}', '${communityId}');`)

    db.run(`DELETE FROM usersToCommunities
            WHERE rowid NOT IN (
            SELECT MIN(rowid)
            FROM usersToCommunities
            GROUP BY telegramId, communityId)`)

    if (check=="ok") {
      db.run(`UPDATE communitiesList 
              SET recordingTime='${new Date().toLocaleString()}'
              WHERE jsonFollowersList='${jsonFollowersList}';`)
    }else{
      db.run(`INSERT INTO communitiesList (communityId, recordingTime, jsonFollowersList)
              VALUES ('${communityId}', '${new Date().toLocaleString()}', '${jsonFollowersList}');`)
    }

  })
}

async function comparisonCommunitySubscribers(communityId) {//сравнение последнего записанного json с текущим
  let oldData = await requestLastRecord(communityId);
  if (oldData.length == 0) {
    return "not ok"
  } else {
    let oldDataID = JSON.parse(oldData[0].jsonFollowersList).response.items.map(item => item.id);
    // console.log(oldData)
    let newData = await communitiesUtils.getNewGroupMembersData(communityId);
    let newDataID = JSON.parse(newData).response.items.map(item => item.id)
    // console.log(newDataID)
    let comparison = await comparisonRequestsToTableDB.comparisonID(oldDataID, newDataID)
    if (comparison.includes("Новых подписчиков нет") && comparison.includes("Новых отписавшихся нет")) {
      return "ok"
    } else {
      return "not ok"
    }
  }
}

async function requestLastRecord(communityId) {//запрос последнего записанного json для сообщества
  let sql = `SELECT jsonFollowersList
    FROM communitiesList
    where communityId='${communityId}'
    ORDER BY recordingTime DESC LIMIT 1`

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