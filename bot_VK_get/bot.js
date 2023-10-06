var fs = require('fs');
const { serviceKey } = require('../serviceKey/vkKey');
const { writeToFile, readFile } = require('./utils');
//ввести данные.
//groupId = `richie.r.dragon`;
const fileTarget = `./target`;
exports.fileTarget = fileTarget;

exports.compareMembersData = compareMembersData;
exports.addingNewCommunity = addingNewCommunity;
//compareMembersData()
async function compareMembersData(groupId) {
    const nameFile = `${groupId}.json`;
    const filePath = `./target/${nameFile}`;

    let folder = await creatingFolder();
    let newData = await getNewGroupMembersData(groupId);
    let oldGroupMembersData = getOldGroupMembersDataFromFile(filePath)

    let newGroupMembersData = getMembersIds(newData)

    let subscribed = newGroupMembersData.filter(x => !oldGroupMembersData.includes(x));
    let subscrib = await gettingResultsSubscribers(subscribed);
    //console.log(gettingResultsSubscribers(subscribed))

    let unSubscribed = oldGroupMembersData.filter(x => !newGroupMembersData.includes(x));
    let unSubscrib = await gettingResultsNoSubscribers(unSubscribed);
    //console.log(gettingResultsNoSubscribers(unSubscribed))

    writeToFile(filePath, newData)
    // let resultat=`${subscrib}
    //               ${unSubscrib}`
    return `${subscrib};
${unSubscrib};`
}

async function addingNewCommunity(groupId) {
    const nameFile = `${groupId}.json`;
    const filePath = `./target/${nameFile}`;

    let folder = await creatingFolder();
    let newData = await getNewGroupMembersData(groupId);
    writeToFile(filePath, newData)
    return `Сообщество добавлено`
}

async function creatingFolder() {
    if (!fs.existsSync(fileTarget)) {
        fs.mkdirSync(fileTarget);
    }
}

async function getNewGroupMembersData(groupId) {
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

async function gettingResultsNoSubscribers(noSubscribers) {
    if (noSubscribers.length == 1) {
        return `Отписался: ${noSubscribers}`
    } else if (noSubscribers.length > 1) {
        return `Отписались: ${noSubscribers}`
    } else {
        return 'Новых отписавшихся нет'
    }
}

async function gettingResultsSubscribers(subscribers) {
    if (subscribers.length == 1) {
        return `Подписался: ${subscribers}`
    } else if (subscribers.length > 1) {
        return `Подписались: ${subscribers}`
    } else {
        return 'Новых подписчиков нет'
    }
}