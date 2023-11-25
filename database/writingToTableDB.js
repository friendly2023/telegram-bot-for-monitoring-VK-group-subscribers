const sqlite3 = require('sqlite3').verbose();
const communitiesUtils = require('../bot_VK_get/bot.js');

exports.writeToFileSQL = writeToFileSQL;

let db = new sqlite3.Database('./database/vkDB.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

// (async () => console.log(await writeToFileSQL('412993464', 'Friendly', 'richie.r.dragon')))()
// (async () => console.log(await requestLastRecord('richie.r.dragon')))()

async function writeToFileSQL(telegramId, firstName, communityId) {
  let check= await verificationIdForAuthenticity(communityId)
  if (check=='ok') {
    let newDataGroup = await communitiesUtils.getNewGroupMembersData(communityId);
  //console.log(newDataGroup)
  let newNameGroup = await communitiesUtils.getCommunityName(communityId);
  //console.log(newNameGroup)
  let dataInSQL = await writeToSQL(telegramId, firstName, newDataGroup, newNameGroup, communityId);
  return `Данные  по сообществу "${newNameGroup}" добавлены/обновлены`
  } else{
    return `Сообщества с id "${communityId}" не существует`
  }
  
}

async function verificationIdForAuthenticity(communityId) {//проверка на подлинность
  let url = `https://vk.com/${communityId}`;
    const response = await fetch(url, { method: 'GET' });
    if (response.ok) {
      return 'ok'
    } else {
      return 'not ok'
    }
}

async function writeToSQL(telegramId, firstName, jsonFollowersList, title, communityId) {
    
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

    db.run(`INSERT INTO communitiesList (communityId, recordingTime, jsonFollowersList)
            VALUES ('${communityId}', '${new Date().toLocaleString()}', '${jsonFollowersList}')
            ON CONFLICT(jsonFollowersList) DO UPDATE SET
            communityId='${communityId}', recordingTime='${new Date().toLocaleString()}';`)
  })
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
}



async function requestLastRecord(communityId) {
  let sql = `SELECT recordingTime
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