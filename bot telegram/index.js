const fs = require('fs')
const token = '6510713266:AAEaFfeGn4Kna6hs7qGf76GZD6bRlfR_SA8'
const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(token,{polling: true})

//редактируемое
const fileTarget = './bot VK_get/target/';//путь до папки /target

bot.setMyCommands([
    {command: '/start', description: 'Начальное приветствие'},
    {command: '/list', description: 'Список сообществ'},
])

bot.on('message', msg =>{
    //console.log(msg)
    const text = msg.text;
    const chatId = msg.chat.id;

    if(text === '/start') {
        return bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name}`);
    }
    if(text === '/list') {
        return bot.sendMessage(chatId, `Список сообществ: `, arrayCommunities);
    }
    return bot.sendMessage(chatId, `Хз о чем ты..`);
})

const arrayCommunities = {//подключение для кнопок '/list'
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'текст кнопки', callback_data: '8989'}]
        ]
    })
}

function searchFileTarget(){//поиск файлов в папке
    return fs.readdirSync(fileTarget)
// let listFileTarget = fs.readdirSync(fileTarget).forEach(file => {
//     console.log(file);
//   });
}