const sqlite3 = require('sqlite3').verbose();

class SelectResult {
    title!: string;
    communityId!: string;
}

class ResultSelectTime {
    communityId!: string;
    recordingTime!: string;
    jsonFollowersList!: string;
}

let db = new sqlite3.Database('./src/database/vkDB.db', (err: any) => {
    if (err) {
        console.error(err.message);
    }
});

export async function creatingIdArray(telegramId: number): Promise<string[]> {//создание массива id сообществ
    let arrayDataCommunitiesTitleCommunityId: SelectResult[] = await requestByUser(telegramId)
    let communitiesList: string[] = []
    for (let i = 0; i < arrayDataCommunitiesTitleCommunityId.length; i++) {
        communitiesList.push(arrayDataCommunitiesTitleCommunityId[i].communityId)
    }
    return communitiesList
}

export async function creatingTitleArray(telegramId: number): Promise<string[]> {//создание массива названий сообществ
    let arrayDataCommunitiesTitleCommunityId: SelectResult[] = await requestByUser(telegramId)
    let communitiesList: string[] = []
    for (let i = 0; i < arrayDataCommunitiesTitleCommunityId.length; i++) {
        communitiesList.push(arrayDataCommunitiesTitleCommunityId[i].title)
    }
    return communitiesList
}

async function requestByUser(telegramId: number): Promise<SelectResult[]> {//вывод запроса в переменную
    let selectResult: SelectResult[] = await resultSelect(telegramId)
    return selectResult
}

function resultSelect(telegramId: number): Promise<SelectResult[]> {//запрос
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

export async function creatingTitleArrayTime(communityId: string): Promise<string[]> {
    let timeCommunityId: ResultSelectTime[] = await requestByUserTime(communityId);
    let communitiesList: string[] = []
    for (let i = 0; i < timeCommunityId.length; i++) {
        communitiesList.push(timeCommunityId[i].recordingTime)
    }
    return communitiesList
}

async function requestByUserTime(communityId: string): Promise<ResultSelectTime[]> {//вывод запроса в переменную
    let selectResult: ResultSelectTime[] = await resultSelectTime(communityId)
    return selectResult
}

function resultSelectTime(communityId: string): Promise<ResultSelectTime[]> {//запрос
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