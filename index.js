const fs = require('fs')
const { token } = require('./serviceKey/telegramKey.js');
const { fileTarget } = require('./bot_VK_get/bot.js');
const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(token, { polling: true })
const communitiesUtils = require('./bot_VK_get/bot.js');
const writingToDB = require('./database/writingToTableDB.js');//запись
const delToDB = require('./database/delToTableDB.js');//удаление
const requestsToDB = require('./database/requestsToTableDB.js');//запросы

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
            return await bot.sendMessage(chatId, `Введите ID сообщества в формате:
            ID: ...`);
        }
        // if (text === '/del') {
        //     return await delToDB.delToFileSQL(chatId,)
        //         .then(result => bot.sendMessage(chatId, `${result}`));
        //}
        if (text.slice(0, 3) == 'ID:') {
            groupId = text.slice(3);
            return await writingToDB.writeToFileSQL(chatId, msg.from.first_name, groupId)
                .then(result => bot.sendMessage(chatId, `${result}`));
            // return await communitiesUtils.addingNewCommunity(groupId, chatId)
            //     .then(result => bot.sendMessage(chatId, `${result}`));
        }
        return await bot.sendMessage(chatId, `Хз о чем ты..`);
    })

    bot.on('callback_query', async msg => {//ответ на кнопку '/communities'
        const groupId = msg.data;
        const chatId = msg.message.chat.id;
        return await bot.sendMessage(chatId, `Выберете время для сравнения: `,
        await creatureArrayTimeCommunities(groupId));
    })
    // bot.on('callback_query', async msg => {//ответ на кнопки кнопок '/communities'
    //     const time = msg.data;
    //     const chatId = msg.message.chat.id;
    //     const result = await communitiesUtils.compareMembersData(groupId, chatId);
    //     return await bot.sendMessage(chatId, `${result}`);
    // })
}

async function creatureArrayCommunities(chatId) {//подключение для кнопок '/communities'
    return { reply_markup: { inline_keyboard: await searchFileTarget(chatId) } }
}

async function searchFileTarget(chatId) {//поиск файлов в папке+генерация массива для кнопки//поиск в бд+генерация массива для кнопки
    let idArray=await requestsToDB.creatingIdArray(chatId)
    console.log(idArray)
    let titleArray=await requestsToDB.creatingTitleArray(chatId)
    console.log(titleArray)
    let buttonsArray = []
    for (let i = 0; i < idArray.length; i++) {
        buttonsArray.push([{ text: titleArray[i], callback_data: idArray[i] }])
    }
    //requestsToDB.closeDatabase()
    return buttonsArray
}

async function creatureArrayTimeCommunities(communityId) {//подключение для кнопок ответов на кнопки '/communities'
    return { reply_markup: { inline_keyboard: await requestTime(communityId) } }
}

async function requestTime(communityId) {
    let timeArray=await requestsToDB.creatingTitleArrayTime(communityId)
    console.log(timeArray)
    let buttonsArray = []
    for (let i = 0; i < timeArray.length; i++) {
        buttonsArray.push([{ text: timeArray[i], callback_data: timeArray[i] }])
    }
    return buttonsArray
}