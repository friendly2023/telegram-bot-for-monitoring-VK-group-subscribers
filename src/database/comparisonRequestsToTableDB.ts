const sqlite3 = require('sqlite3').verbose();
import { getNewGroupMembersData } from '../bot_VK_get/bot'

export class SelectResultDB {
    jsonFollowersList!: string;
    title!: string;
    communityId!: string;
    recordingTime!: string;
}

export let db = new sqlite3.Database('./src/database/vkDB.db', (err: any) => {
    if (err) {
        console.error(err.message);
    }
});

export async function comparisonID(oldDataID: number[], newDataID: number[]): Promise<string> {
    let subscribed: number[] = newDataID.filter(x => !oldDataID.includes(x));
    let subscrib: string = await gettingResultsSubscribers(subscribed);

    let unSubscribed: number[] = oldDataID.filter(x => !newDataID.includes(x));
    let unSubscrib: string = await gettingResultsNoSubscribers(unSubscribed);

    return `${subscrib};
${unSubscrib};`
}

async function gettingResultsSubscribers(subscribers: number[]): Promise<string> {
    if (subscribers.length == 1) {
        return `Подписался: ${subscribers}`
    } else if (subscribers.length > 1) {
        return `Подписались: ${subscribers}`
    } else {
        return 'Новых подписчиков нет'
    }
}

async function gettingResultsNoSubscribers(noSubscribers: number[]): Promise<string> {
    if (noSubscribers.length == 1) {
        return `Отписался: ${noSubscribers}`
    } else if (noSubscribers.length > 1) {
        return `Отписались: ${noSubscribers}`
    } else {
        return 'Новых отписавшихся нет'
    }
}

export async function comparisonCommunitiesByTime(communityId: string, recordingTime: string): Promise<string> {
    let oldData: string = await requestByUserJson(communityId, recordingTime);
    let oldDataID: number[] = JSON.parse(oldData).response.items.map((item: { id: number; }) => item.id);

    let newData: string = await getNewGroupMembersData(communityId);
    let newDataID: number[] = JSON.parse(newData).response.items.map((item: { id: number; }) => item.id);

    let comparison: string = await comparisonID(oldDataID, newDataID);
    return comparison
}

async function requestByUserJson(communityId: string, recordingTime: string): Promise<string> {//вывод запроса в переменную
    let selectResult: SelectResultDB[] = await requestResultSelectJson(communityId, recordingTime);
    return selectResult[0].jsonFollowersList
}

async function requestResultSelectJson(communityId: string, recordingTime: string): Promise<SelectResultDB[]> {//запрос строки json выбранного времени
    let sql = `SELECT jsonFollowersList
    FROM communitiesList
    where communityId='${communityId}' and recordingTime='${recordingTime}'`

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