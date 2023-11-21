const sqlite3 = require('sqlite3').verbose();
const communitiesUtils = require('../bot_VK_get/bot.js');

exports.writeToFileSQL = writeToFileSQL;

async function writeToFileSQL(telegramId, firstName, communityId) {
  let newDataGroup = await communitiesUtils.getNewGroupMembersData(communityId);
  //console.log(newDataGroup)
  let newNameGroup = await communitiesUtils.getCommunityName(communityId);
  //console.log(newNameGroup)
  let dataInSQL = await writeToSQL(telegramId, firstName, newDataGroup, newNameGroup, communityId);
  return `Данные  по сообществу '${newNameGroup}' добавлены/обновлены`
}

async function writeToSQL(telegramId, firstName, jsonFollowersList, title, communityId) {
    let db = new sqlite3.Database('./database/vkDB.db', (err) => {
    if (err) {
      console.error(err.message);
    }
  });
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
            VALUES ('${communityId}', '${generationDate()}', '${jsonFollowersList}')
            ON CONFLICT(jsonFollowersList) DO UPDATE SET
            communityId='${communityId}', recordingTime='${generationDate()}';`)

  })
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
}

function generationDate() {
  var myDate = new Date();

  let day = myDate.getDate()
  let month = myDate.getMonth() + 1
  let year = myDate.getFullYear()
  let minutes = myDate.getMinutes()
  let hours=myDate.getHours()

  var fullData = `${hours}:${minutes} ${day}.${month}.${year}`
  return fullData
}