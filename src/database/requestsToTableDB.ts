const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./src/database/vkDB.db', (err: any) => {
    if (err) {
        console.error(err.message);
    }
});

export async function creatingIdArray(telegramId: number) {//создание массива id сообществ
    let arrayDataCommunitiesTitleCommunityId = await requestByUser(telegramId)
    let communitiesList: any[] = []
    for (let i = 0; i < arrayDataCommunitiesTitleCommunityId.length; i++) {
        communitiesList.push(arrayDataCommunitiesTitleCommunityId[i].communityId)
    }
    return communitiesList
}

export async function creatingTitleArray(telegramId: number) {//создание массива названий сообществ
    let arrayDataCommunitiesTitleCommunityId = await requestByUser(telegramId)
    let communitiesList: any[] = []
    for (let i = 0; i < arrayDataCommunitiesTitleCommunityId.length; i++) {
        communitiesList.push(arrayDataCommunitiesTitleCommunityId[i].title)
    }
    return communitiesList
}

async function requestByUser(telegramId: number) {//вывод запроса в переменную
    let selectResult: any = await resultSelect(telegramId)
    return selectResult
}

function resultSelect(telegramId: number): any {//запрос
    let sql = `SELECT c.title, c.communityId
    FROM usersToCommunities as utc
    left join communities as c
    on utc.communityId=c.communityId
    where utc.telegramId='${telegramId}'`

    return new Promise(
        (resolve: any, reject: any) => {
            let result: any = db.all(sql, [], (err: { message: any; }, rows: any) => {
                if (err) {
                    console.error(err.message);
                }
                resolve(rows)
            })
        }
    )
}

export async function creatingTitleArrayTime(communityId: string): Promise<any> {
    let timeCommunityId: any = await requestByUserTime(communityId);
    let communitiesList: string[] = []
    for (let i = 0; i < timeCommunityId.length; i++) {
        communitiesList.push(timeCommunityId[i].recordingTime)
    }
    return communitiesList
}

async function requestByUserTime(communityId: string): Promise<any> {//вывод запроса в переменную
    let selectResult: any = await resultSelectTime(communityId)
    return selectResult
}

function resultSelectTime(communityId: string): Promise<any> {//запрос
    let sql = `SELECT *
    FROM communitiesList
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