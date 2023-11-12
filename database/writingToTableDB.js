const sqlite3 = require('sqlite3').verbose();

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

async function writingToUsers(telegramId, firstName) {
  let sql = `INSERT INTO users
             VALUES ('${telegramId}', '${firstName}')`

  db.serialize(() => {
    db.each(sql, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  });

  // закрытие бд
  db.close();
}

async function writingToCommunities(communityId, title) {
  let sql = `INSERT INTO communities
             VALUES ('${communityId}', '${title}')`

  db.serialize(() => {
    db.each(sql, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  });

  // закрытие бд
  db.close();
}

async function writingToUsersToCommunities(telegramId, communityId) {
  let sql = `INSERT INTO usersToCommunities
             VALUES ('${telegramId}', '${communityId}')`

  db.serialize(() => {
    db.each(sql, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  });

  // закрытие бд
  db.close();
}

async function writingToCommunitiesList(communityId, jsonFollowersList) {
  var myDate = new Date(); 
  let sql = `INSERT INTO communitiesList
             VALUES ('${communityId}', '${myDate}', '${jsonFollowersList}')`

  db.serialize(() => {
    db.each(sql, (err) => {
      if (err) {
        console.error(err.message);
      }
    });
  });

  // закрытие бд
  db.close();
}