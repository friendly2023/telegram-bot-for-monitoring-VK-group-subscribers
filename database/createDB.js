const sqlite3 = require('sqlite3').verbose();

// открытие БД
let db = new sqlite3.Database('./database/vkDB.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

//запросы на создание таблиц в БД
let tableUsers = `CREATE TABLE users (
  telegramId varchar(20) UNIQUE,
  firstName varchar(100)
);`;
let tadleCommunities = `CREATE TABLE communities (
  communityId varchar(100) UNIQUE,
  title varchar(100)
);`;
let tableUsersToCommunities = `CREATE TABLE usersToCommunities (
  telegramId varchar(20),
  communityId varchar(100)
);`;
let tableCommunitiesList = `CREATE TABLE communitiesList (
  communityId varchar(100),
  recordingTime varchar(20),
  jsonFollowersList mediumtext
);`;

db.serialize(() => {
  db.run(tableUsers)
  db.run(tadleCommunities)
  db.run(tableUsersToCommunities)
  db.run(tableCommunitiesList)
});

// закрытие бд
db.close();