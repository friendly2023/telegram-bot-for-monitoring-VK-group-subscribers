const fs = require('fs')
//const token = '6510713266:AAEaFfeGn4Kna6hs7qGf76GZD6bRlfR_SA8'
const { token } = require('./serviceKey/telegramKey.js');
const { fileTarget } = require('./bot_VK_get/bot.js');
const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(token, { polling: true })
const compareMembersData = require('./bot_VK_get/bot.js');
const addingNewCommunity = require('./bot_VK_get/bot.js');

//редактируемое
//const fileTarget = './bot VK_get/target/';//путь до папки /target

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
    bot.on('message', msg => {
        //console.log(msg)
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            return bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name}`);
        }
        if (text === '/communities') {
            return bot.sendMessage(chatId, `Список сообществ: `, arrayCommunities);
        }
        if (text === '/new') {
            return bot.sendMessage(chatId, `Введите ID сообщества в формате:
            ID: ...`);
        }
        if (text.slice(0,3) == 'ID:') {
            groupId=text.slice(3);
            return compareMembersData.addingNewCommunity(groupId)
            .then(result => bot.sendMessage(chatId, `${result}`));
        }
        return bot.sendMessage(chatId, `Хз о чем ты..`);
    })

    bot.on('callback_query', msg => {//ответ на кнопку '/communities'
        const groupId = msg.data;
        const chatId = msg.message.chat.id;
        return compareMembersData.compareMembersData(groupId)
        .then(result => bot.sendMessage(chatId, `${result}`))
    })
}

const arrayCommunities = {//подключение для кнопок '/communities'
    reply_markup: {
        inline_keyboard: searchFileTarget()
    }
}

function searchFileTarget() {//поиск файлов в папке+генерация массива для кнопки
    let arrayFile=new Array()
    let i =0
    while (i<fs.readdirSync(fileTarget).length) {
        let t=[{ text: `${fs.readdirSync(fileTarget)[i].slice(0,-5)}`, callback_data: `${fs.readdirSync(fileTarget)[i].slice(0,-5)}` }]
        arrayFile.push(t);
        i++
    }
    return arrayFile
}
