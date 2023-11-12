const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/testDB.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

(async () => console.log(await rabataDatabase()))()


async function rabataDatabase() {
    let selectResult = await resultSelect()
    closeDatabase()
    return selectResult
}

function resultSelect() {
    let sql = `SELECT tttt FROM Persons`
    return new Promise(
        (resolve, reject) => {
            result =  db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error(err.message);
                }
                resolve(rows)
                console.log("Запрос выполнен")
            })
        }
    )
}

function closeDatabase() {
    console.log('закрытие бд')
    db.close()
}

