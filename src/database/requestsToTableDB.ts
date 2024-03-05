import { SelectResultDB, db } from './comparisonRequestsToTableDB'

export async function creatingIdArray(telegramId: number): Promise<string[]> {//создание массива id сообществ
    let arrayDataCommunitiesTitleCommunityId: SelectResultDB[] = await requestByUser(telegramId)
    let communitiesList: string[] = []
    for (let i = 0; i < arrayDataCommunitiesTitleCommunityId.length; i++) {
        communitiesList.push(arrayDataCommunitiesTitleCommunityId[i].communityId)
    }
    return communitiesList
}

export async function creatingTitleArray(telegramId: number): Promise<string[]> {//создание массива названий сообществ
    let arrayDataCommunitiesTitleCommunityId: SelectResultDB[] = await requestByUser(telegramId)
    let communitiesList: string[] = []
    for (let i = 0; i < arrayDataCommunitiesTitleCommunityId.length; i++) {
        communitiesList.push(arrayDataCommunitiesTitleCommunityId[i].title)
    }
    return communitiesList
}

async function requestByUser(telegramId: number): Promise<SelectResultDB[]> {//вывод запроса в переменную
    let selectResult: SelectResultDB[] = await resultSelect(telegramId)
    return selectResult
}

function resultSelect(telegramId: number): Promise<SelectResultDB[]> {//запрос
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
    let timeCommunityId: SelectResultDB[] = await requestByUserTime(communityId);
    let communitiesList: string[] = []
    for (let i = 0; i < timeCommunityId.length; i++) {
        communitiesList.push(timeCommunityId[i].recordingTime)
    }
    return communitiesList
}

async function requestByUserTime(communityId: string): Promise<SelectResultDB[]> {//вывод запроса в переменную
    let selectResult: SelectResultDB[] = await resultSelectTime(communityId)
    return selectResult
}

function resultSelectTime(communityId: string): Promise<SelectResultDB[]> {//запрос
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