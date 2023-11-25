const fs = require('fs')
const { token } = require('./serviceKey/telegramKey.js');
const { fileTarget } = require('./bot_VK_get/bot.js');
const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(token, { polling: true })
const communitiesUtils = require('./bot_VK_get/bot.js');
const writingToDB = require('./database/writingToTableDB.js');//запись
const delToDB = require('./database/delToTableDB.js');//удаление
const requestsToDB = require('./database/requestsToTableDB.js');//запросы
const comparisonRequestsToDB = require('./database/comparisonRequestsToTableDB.js');//сравнение старого и нового

bot.setMyCommands([
    {
        command: '/start',
        description: 'Начальное приветствие'
    },
    {
        command: '/communities',
        description: 'Список сообществ'
    },
    {
        command: '/new',
        description: 'Добавить/обновить данные сообщества'
    },
    {
        command: '/del',
        description: 'Удалить данные сообщества'
    }
])

outputMessage()
function outputMessage() {
    bot.on('message', async msg => {
        //console.log(msg)
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return await bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name}`);
        }
        if (text === '/communities') {
            return await bot.sendMessage(chatId, `Список сообществ: `,
                await creatureArrayCommunities(chatId));
        }
        if (text === '/new') {
            return await bot.sendMessage(chatId, `Пришлите ссылку на сообщество которое хотите добавить`);
        }
        if (text === '/del') {
            return await bot.sendMessage(chatId, `Сообщества для удаления: `,
                await creatureArrayCommunitiesDel(chatId));
        }
        if (text.slice(0, 15) == 'https://vk.com/') {
            groupId = text.slice(15);
            return await writingToDB.writeToFileSQL(chatId, msg.from.first_name, groupId)
                .then(result => bot.sendMessage(chatId, `${result}`));
        }
        return await bot.sendMessage(chatId, `Хз о чем ты..`);
    })

    bot.on('callback_query', async msg => {//ответ на кнопку '/communities'
        const chatId = msg.message.chat.id;
        const text = msg.data;
        if (text.slice(0, 8) == 'groupId:') {
            const groupId = text.slice(8);
            return await bot.sendMessage(chatId, `Выберете время для сравнения: `,
                await creatureArrayTimeCommunities(groupId));
        } else if(text.slice(0, 5) == 'time:'){
            const groupIdTime=text.slice(5);
            const time=text.slice(-20)
            const groupId = groupIdTime.slice(0, -21);
            // console.log(groupIdTime)
            // console.log(time)
            // console.log(groupId)
            return await comparisonRequestsToDB.comparisonCommunitiesByTime(groupId, time)
                .then(result => bot.sendMessage(chatId, `${result}`));
        } else if(text.slice(0, 4) == 'new'){
            return await bot.sendMessage(chatId, `Пришлите ссылку на сообщество которое хотите добавить`);
        }else if(text.slice(0, 4) == 'del:'){
            const groupId = text.slice(4);
            return await delToDB.delToFileSQL(chatId, groupId)
                .then(result => bot.sendMessage(chatId, `${result}`));
        }else{
            console.log('Ответа на запрос не найден')
        }
    })
}

async function creatureArrayCommunities(chatId) {//подключение для кнопок '/communities'
    let buttonGeneratorArray = await searchFileTarget(chatId)
    if (buttonGeneratorArray.length == 0) {
        return { reply_markup: { inline_keyboard: [[{ text: '<<пусто>>', callback_data: `new` }],
                                                   [{ text: 'Добавить сообщество?', callback_data: `new` }]] } }
    }else{
        return { reply_markup: { inline_keyboard: buttonGeneratorArray } }
    }
}

async function searchFileTarget(chatId) {//поиск в бд+генерация массива для кнопки
    let idArray=await requestsToDB.creatingIdArray(chatId)
    // console.log(idArray)
    let titleArray=await requestsToDB.creatingTitleArray(chatId)
    // console.log(titleArray)
    let buttonsArray = []
    for (let i = 0; i < idArray.length; i++) {
        buttonsArray.push([{ text: titleArray[i], callback_data: `groupId:${idArray[i]}` }])
    }
    return buttonsArray
}

async function creatureArrayTimeCommunities(communityId) {//подключение для кнопок ответов на кнопки '/communities'
    return { reply_markup: { inline_keyboard: await requestTime(communityId) } }
}

async function requestTime(communityId) {
    let timeArray=await requestsToDB.creatingTitleArrayTime(communityId)
    // console.log(timeArray)
    let buttonsArray = []
    for (let i = 0; i < timeArray.length; i++) {
        buttonsArray.push([{ text: timeArray[i], callback_data: `time:${communityId}:${timeArray[i]}` }])
    }
    return buttonsArray
}

async function creatureArrayCommunitiesDel(chatId) {//подключение для кнопок '/del'
    let buttonGeneratorArray = await searchFileTargetDel(chatId)
    if (buttonGeneratorArray.length == 0) {
        return { reply_markup: { inline_keyboard: [[{ text: '<<пусто>>', callback_data: `new` }],
                                                   [{ text: 'Добавить сообщество?', callback_data: `new` }]] } }
    }else{
        return { reply_markup: { inline_keyboard: buttonGeneratorArray } }
    }
}

async function searchFileTargetDel(chatId) {//поиск в бд+генерация массива для кнопки '/del'
    let idArray=await requestsToDB.creatingIdArray(chatId)
    // console.log(idArray)
    let titleArray=await requestsToDB.creatingTitleArray(chatId)
    // console.log(titleArray)
    let buttonsArray = []
    for (let i = 0; i < idArray.length; i++) {
        buttonsArray.push([{ text: titleArray[i], callback_data: `del:${idArray[i]}` }])
    }
    return buttonsArray
}