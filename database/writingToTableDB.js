const sqlite3 = require('sqlite3').verbose();
const communitiesUtils = require('../bot_VK_get/bot.js');

// открытие БД
let db = new sqlite3.Database('./database/vkDB.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

//проверки
// writingToUsers(12345, 'Friendly')
// writingToCommunities('grut', 'название грут')
// writingToUsersToCommunities(123456, 'grut6')
// writingToCommunitiesList('gruk7t', 'rtuhgrt5h;ljh')

// exports.writingToUsers = writingToUsers;
// exports.writingToCommunities = writingToCommunities;
// exports.writingToUsersToCommunities = writingToUsersToCommunities;
// exports.writingToCommunitiesList = writingToCommunitiesList;

exports.writeToFileSQL = writeToFileSQL;

async function writeToFileSQL(telegramId, firstName, communityId) {
  let newDataGroup = await communitiesUtils.getNewGroupMembersData(communityId);
  console.log(newDataGroup)
  let newNameGroup = await communitiesUtils.getCommunityName(communityId);
  console.log(newNameGroup)
  let dataInSQL = await writeToSQL(telegramId, firstName, newDataGroup, newNameGroup, communityId);
  return `Сообщество добавлено в ДБ`
}

async function writeToSQL(telegramId, firstName, jsonFollowersList, title, communityId) {
  var myDate = new Date(); 
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
            VALUES ('${communityId}', '${myDate}', '${jsonFollowersList}')
            ON CONFLICT(jsonFollowersList) DO UPDATE SET
            communityId='${communityId}', recordingTime='${myDate}';`)
  
  })
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
}