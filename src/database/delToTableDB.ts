import { SelectResultDB, db } from './comparisonRequestsToTableDB'

export async function delToFileSQL(chatId: number, communityId: string): Promise<string> {
    let delCommunities: void = await delToSQL(chatId, communityId);
    let communityNameFromDB: string = await gettingResponseFromDB(communityId);
    return `Сообщество "${communityNameFromDB}" удалено`
}

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
    let selectResult: SelectResultDB[] = await gettingCommunityNameFromDB(communityId);
    return selectResult[0].title
}

async function gettingCommunityNameFromDB(communityId: string): Promise<SelectResultDB[]> {
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