const fs = require('fs')
const { token } = require('./serviceKey/telegramKey.js');
const { fileTarget } = require('./bot_VK_get/bot.js');
const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(token, { polling: true })
const communitiesUtils = require('./bot_VK_get/bot.js');

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
        description: 'Добавление нового сообщества'
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
        if (text.slice(0, 3) == 'ID:') {
            groupId = text.slice(3);
            return await communitiesUtils.addingNewCommunity(groupId, chatId)
                .then(result => bot.sendMessage(chatId, `${result}`));
        }
        return await bot.sendMessage(chatId, `Хз о чем ты..`);
    })

    bot.on('callback_query', async msg => {//ответ на кнопку '/communities'
        const groupId = msg.data;
        const chatId = msg.message.chat.id;
        const result = await communitiesUtils.compareMembersData(groupId, chatId);
        return await bot.sendMessage(chatId, `${result}`);
    })
}

async function creatureArrayCommunities(chatId) {//подключение для кнопок '/communities'
    return { reply_markup: { inline_keyboard: await searchFileTarget(chatId) } }
}

async function searchFileTarget(chatId) {//поиск файлов в папке+генерация массива для кнопки
    let communitiesList = fs.readdirSync(`${fileTarget}/${chatId}`)
    let buttonsArray = []
    for (c of communitiesList) {
        communityId = c.slice(0, -5)
        //console.log(communityId)
        cName = await communitiesUtils.getCommunityName(communityId)
        buttonsArray.push([{ text: cName, callback_data: communityId }])
    }
    return buttonsArray
}
