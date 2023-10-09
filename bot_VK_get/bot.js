var fs = require('fs');
const { serviceKey } = require('../serviceKey/vkKey');
const { writeToFile, readFile } = require('./utils');
const fileTarget = `./target`;
exports.fileTarget = fileTarget;

exports.compareMembersData = compareMembersData;
exports.addingNewCommunity = addingNewCommunity;
exports.getCommunityName = getCommunityName;

async function compareMembersData(groupId, chatId) {
    const nameFile = `${groupId}.json`;
    const filePath = `${fileTarget}/${chatId}/${nameFile}`;

    let folder = await creatingFolder(chatId);
    let newData = await getNewGroupMembersData(groupId);
    let oldGroupMembersData = getOldGroupMembersDataFromFile(filePath)

    let newGroupMembersData = getMembersIds(newData)

    let subscribed = newGroupMembersData.filter(x => !oldGroupMembersData.includes(x));
    let subscrib = await gettingResultsSubscribers(subscribed);
    
    let unSubscribed = oldGroupMembersData.filter(x => !newGroupMembersData.includes(x));
    let unSubscrib = await gettingResultsNoSubscribers(unSubscribed);
    
    writeToFile(filePath, newData)

    return `${subscrib};
${unSubscrib};`
}

async function addingNewCommunity(groupId, chatId) {
    const nameFile = `${groupId}.json`;
    const filePath = `${fileTarget}/${chatId}/${nameFile}`;

    let folder = await creatingFolder(chatId);
    let newData = await getNewGroupMembersData(groupId);
    writeToFile(filePath, newData)
    return `Сообщество добавлено`
}

async function creatingFolder(chatId) {
    if (!fs.existsSync(`${fileTarget}/${chatId}`)) {
        fs.mkdirSync(`${fileTarget}/${chatId}`);
    }
}

async function getNewGroupMembersData(groupId) {
    //console.log("Беру данные из ВК для ", groupId)
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

async function getCommunityName(groupId) {
    //console.log("Беру из ВК инфу о ", groupId)
    return fetch("https://api.vk.com/method/groups.getById", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded",
            "accept": "*/*",
            "accept-language": "ru-RU,ru;q=0.9,en-GB;q=0.8,en;q=0.7,en-US;q=0.6",
        },
        "body": `group_id=${groupId}&access_token=${serviceKey}&v=5.131&fields=members_count`,
        "method": "POST"
    })
        .then(response => response.json())
        .then(data => {
            const communityName = data.response[0].name;
            return `${communityName}`;
          })
          .catch(error => {
            console.error('Error:', error);
          });
}

function getOldGroupMembersDataFromFile(path) {
    //console.log("Беру данные из файла для ", path)
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