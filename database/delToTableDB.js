const sqlite3 = require('sqlite3').verbose();

// открытие БД
let db = new sqlite3.Database('./database/vkDB.db', (err) => {
    if (err) {
        console.error(err.message);
    }
});

exports.delToFileSQL = delToFileSQL;
// (async () => console.log(await delToFileSQL('412993464', 'public222303599')))()

async function delToFileSQL(chatId, groupId) {
    let delCommunities= await delToSQL(chatId, groupId)
    return `Сообщество "${groupId}" удалено`    
}

async function delToSQL(telegramId, communityId) {
    let db = new sqlite3.Database('./database/vkDB.db', (err) => {
        if (err) {
            console.error(err.message);
        }
    });
    db.serialize(() => {

        db.run(`DELETE FROM usersToCommunities
                WHERE telegramId='${telegramId}' and communityId='${communityId}';`)
    })
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
    });
}