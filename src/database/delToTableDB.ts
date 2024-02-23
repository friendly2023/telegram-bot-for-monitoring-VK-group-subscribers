const sqlite3 = require('sqlite3').verbose();

class SelectResult {
    title!: string;
}

export async function delToFileSQL(chatId: number, communityId: string): Promise<string> {
    let delCommunities: void = await delToSQL(chatId, communityId);
    let communityNameFromDB: string = await gettingResponseFromDB(communityId);
    return `Сообщество "${communityNameFromDB}" удалено`
}
let db = new sqlite3.Database('./src/database/vkDB.db', (err: { message: any }) => {
    if (err) {
        console.error(err.message);
    }
});

async function delToSQL(telegramId: number, communityId: string): Promise<void> {
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

async function gettingResponseFromDB(communityId: string): Promise<string> {//вывод запроса в переменную
    let selectResult: SelectResult[] = await gettingCommunityNameFromDB(communityId);
    return selectResult[0].title
}

async function gettingCommunityNameFromDB(communityId: string): Promise<SelectResult[]> {
    let sql = `SELECT title
    FROM communities
    where communityId='${communityId}'`

    return new Promise(
        (resolve, reject) => {
            let result: any = db.all(sql, [], (err: { message: any; }, rows: any) => {
                if (err) {
                    console.error(err.message);
                }
                resolve(rows)
            })
        }
    )
}