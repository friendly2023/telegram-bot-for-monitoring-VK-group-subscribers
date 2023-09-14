const { serviceKey } = require('./serviceKey');
const { writeToFile, readFile } = require('./utils');
//ввести данные.
const groupId = `mikannoyuki`;
const nameFile = `Подписчики группы ${groupId}.json`;
const filePath = `./target/${nameFile}`;
exports.filePath = filePath;

compareMembersData()

async function compareMembersData() {
    let newData = await getNewGroupMembersData();
    let oldGroupMembersData = getOldGroupMembersDataFromFile(filePath)

    let newGroupMembersData = getMembersIds(newData)

    let subscribed = newGroupMembersData.filter(x => !oldGroupMembersData.includes(x));
    console.log(gettingResultsSubscribers(subscribed))

    let unSubscribed = oldGroupMembersData.filter(x => !newGroupMembersData.includes(x));
    console.log(gettingResultsNoSubscribers(unSubscribed))

    writeToFile(filePath, newData)
}


async function getNewGroupMembersData() {
    return fetch("https://api.vk.com/method/groups.getMembers", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "accept": "*/*",
            "accept-language": "ru-RU,ru;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
        },
        "body": `group_id=${groupId}&access_token=${serviceKey}&v=5.131&fields=members_count`,
        "method": "POST"
    })
        .then(response => response.json())
}

function getOldGroupMembersDataFromFile(path) {
    return getMembersIds(readFile(path))
}

function getMembersIds(data) {
    return data.response.items.map(item => item.id)
}

function gettingResultsNoSubscribers(noSubscribers) {
    if (noSubscribers.length == 1) {
        return `Отписался: ${noSubscribers}`
    } else if (noSubscribers.length > 1) {
        return `Отписались: ${noSubscribers}`
    } else {
        return 'Новых отписавшихся нет'
    }
}

function gettingResultsSubscribers(subscribers) {
    if (subscribers.length == 1) {
        return `Подписался: ${subscribers}`
    } else if (subscribers.length > 1) {
        return `Подписались: ${subscribers}`
    } else {
        return 'Новых подписчиков нет'
    }
}