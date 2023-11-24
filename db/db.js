const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('./db/testDB.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

let sql = `CREATE TABLE Persons (
  LastName varchar(255),
  FirstName varchar(255),
  tttt LONGTEXT
);`;

db.serialize(() => {
  db.each(sql, (err) => {
    if (err) {
      console.error(err.message);
    }
  });
});

// close the database connection
db.close();