const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./src/database/vkDB.db', (err:any) => {
    if (err) {
        console.error(err.message);
    }
});

export async function comparisonID(oldDataID: number[], newDataID: number[]):Promise<string> {
    let subscribed: number[] = newDataID.filter(x => !oldDataID.includes(x));
    let subscrib: string = await gettingResultsSubscribers(subscribed);

    let unSubscribed: number[] = oldDataID.filter(x => !newDataID.includes(x));
    let unSubscrib: string = await gettingResultsNoSubscribers(unSubscribed);

    return `${subscrib};
${unSubscrib};`
}

async function gettingResultsSubscribers(subscribers: number[]):Promise<string> {
    if (subscribers.length == 1) {
        return `Подписался: ${subscribers}`
    } else if (subscribers.length > 1) {
        return `Подписались: ${subscribers}`
    } else {
        return 'Новых подписчиков нет'
    }
}

async function gettingResultsNoSubscribers(noSubscribers: number[]):Promise<string> {
    if (noSubscribers.length == 1) {
        return `Отписался: ${noSubscribers}`
    } else if (noSubscribers.length > 1) {
        return `Отписались: ${noSubscribers}`
    } else {
        return 'Новых отписавшихся нет'
    }
}