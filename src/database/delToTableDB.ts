const sqlite3 = require('sqlite3').verbose();

export async function delToFileSQL(chatId: number, communityId: string): Promise<string> {
    let delCommunities: any = await delToSQL(chatId, communityId)
    return `Сообщество "${communityId}" удалено`
}

async function delToSQL(telegramId: number, communityId: string) {
    let db = new sqlite3.Database('./src/database/vkDB.db', (err: { message: any }) => {
        if (err) {
            console.error(err.message);
        }
    });
    db.serialize(() => {

        db.run(`DELETE FROM usersToCommunities
                WHERE telegramId='${telegramId}' and communityId='${communityId}';`)
    })
    db.close((err: { message: any }) => {
        if (err) {
            console.error(err.message);
        }
    });
}