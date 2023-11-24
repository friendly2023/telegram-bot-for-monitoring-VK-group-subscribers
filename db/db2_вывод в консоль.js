const sqlite3 = require('sqlite3').verbose();

// open database in memory
let db = new sqlite3.Database('./db/testDB.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  //console.log('Connected to the chinook database.');
});

let sql = `SELECT * FROM Persons`;

db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.tttt);
  });
});
// close the database connection
db.close();