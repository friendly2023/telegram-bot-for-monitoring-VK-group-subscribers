const sqlite3 = require('sqlite3').verbose();

// открытие БД
let db = new sqlite3.Database('./database/vkDB.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});




// закрытие бд
db.close();