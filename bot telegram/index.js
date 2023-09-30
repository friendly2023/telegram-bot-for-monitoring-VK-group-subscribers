const fs = require('fs')
const token = '6510713266:AAEaFfeGn4Kna6hs7qGf76GZD6bRlfR_SA8'
const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(token, { polling: true })
const compareMembersData = require('c:/Programming Project/Programming-Project/bot VK_get/bot');


//редактируемое
const fileTarget = 'c:/Programming Project/Programming-Project/bot VK_get/target/';//путь до папки /target

bot.setMyCommands([
    {
        command: '/start',
        description: 'Начальное приветствие'
    },
    {
        command: '/list',
        description: 'Список сообществ'
    },
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
        if (text === '/list') {
            return bot.sendMessage(chatId, `Список сообществ: `, arrayCommunities);
        }
        return bot.sendMessage(chatId, `Хз о чем ты..`);
    })

    bot.on('callback_query', msg => {//ответ на кнопку '/list'
        //const data = msg.data;
        const chatId = msg.message.chat.id;
        return bot.sendMessage(chatId, `${compareMembersData.compareMembersData()}`)
    })
}

const arrayCommunities = {//подключение для кнопок '/list'
    reply_markup: {
        inline_keyboard: searchFileTarget()
    }
}

function searchFileTarget() {//поиск файлов в папке+генерация массива для кнопки
    let arrayFile=new Array()
    let i =0
    while (i<fs.readdirSync(fileTarget).length) {
        let t=[{ text: `${fs.readdirSync(fileTarget)[i]}`, callback_data: `${fs.readdirSync(fileTarget)[i]}` }]
        arrayFile.push(t);
        i++
    }
    return arrayFile
}
