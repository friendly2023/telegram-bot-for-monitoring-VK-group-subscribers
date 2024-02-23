const sqlite3 = require('sqlite3').verbose();
import { getNewGroupMembersData, getCommunityName } from '../bot_VK_get/bot'
import { comparisonID } from './comparisonRequestsToTableDB'

class RequestLastRecord {
    jsonFollowersList!: string;
}

let db = new sqlite3.Database('./src/database/vkDB.db', (err: any) => {
    if (err) {
        console.error(err.message);
    }
});

export async function writeToFileSQL(telegramId: number, firstName: string, communityId: string): Promise<string> {
    let newDataGroup: string = await getNewGroupMembersData(communityId);

    if (newDataGroup.slice(0, 21) == `{"response":{"count":`) {
        let newNameGroup: string | void = await getCommunityName(communityId);
        let dataInSQL = await writeToSQL(telegramId, firstName, newDataGroup, newNameGroup, communityId);
        return `Данные  по сообществу "${newNameGroup}" добавлены/обновлены`
    } else {
        return `Сообщества по предложенной ссылке не существует, проверте правильность написания`
    }
}

async function writeToSQL(telegramId: number, firstName: string, jsonFollowersList: string, title: string | void, communityId: string): Promise<void> {
    let check: string = await comparisonCommunitySubscribers(communityId);
    db.serialize(() => {

        db.run(`INSERT INTO users (telegramId, firstName)
            VALUES ('${telegramId}', '${firstName}')
            ON CONFLICT(telegramId) DO UPDATE SET
            firstName='${firstName}';`)

        db.run(`INSERT INTO communities (communityId, title)
            VALUES ('${communityId}', '${title}')
            ON CONFLICT(communityId) DO UPDATE SET
            title='${title}';`)

        db.run(`INSERT INTO usersToCommunities(telegramId, communityId)
            VALUES ('${telegramId}', '${communityId}');`)

        db.run(`DELETE FROM usersToCommunities
            WHERE rowid NOT IN (
            SELECT MIN(rowid)
            FROM usersToCommunities
            GROUP BY telegramId, communityId)`)

        if (check == "ok") {
            db.run(`UPDATE communitiesList 
              SET recordingTime='${new Date().toLocaleString()}'
              WHERE jsonFollowersList='${jsonFollowersList}';`)
        } else {
            db.run(`INSERT INTO communitiesList (communityId, recordingTime, jsonFollowersList)
              VALUES ('${communityId}', '${new Date().toLocaleString()}', '${jsonFollowersList}');`)
        }
    })
}

async function comparisonCommunitySubscribers(communityId: string): Promise<string> {
    let oldData: RequestLastRecord[] = await requestLastRecord(communityId);
    if (oldData.length == 0) {
        return "not ok"
    } else {
        let oldDataID: number[] = JSON.parse(oldData[0].jsonFollowersList).response.items.map((item: { id: number; }) => item.id);
        let newData: string = await getNewGroupMembersData(communityId);
        let newDataID: number[] = JSON.parse(newData).response.items.map((item: { id: number; }) => item.id)
        let comparison: string = await comparisonID(oldDataID, newDataID)

        if (comparison.includes("Новых подписчиков нет") && comparison.includes("Новых отписавшихся нет")) {
            return "ok"
        } else {
            return "not ok"
        }
    }
}

async function requestLastRecord(communityId: string): Promise<RequestLastRecord[]> {//запрос последнего записанного json для сообщества
    let sql = `SELECT jsonFollowersList
      FROM communitiesList
      where communityId='${communityId}'
      ORDER BY recordingTime DESC LIMIT 1`

    return new Promise(
        (resolve, reject) => {
            let result: any = db.all(sql, [], (err: any, rows: any) => {
                if (err) {
                    console.error(err.message);
                }
                resolve(rows)
            })
        }
    )
}