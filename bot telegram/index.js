const token = '6510713266:AAEaFfeGn4Kna6hs7qGf76GZD6bRlfR_SA8'
const TelegramApi = require('node-telegram-bot-api')
const bot = new TelegramApi(token,{polling: true})

bot.on('message', msg =>{
    //console.log(msg)
    const text = msg.text;
    const chatId = msg.chat.id;

    if(text === '/start') {
        bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name}`);
    }
    if(text === '/info') {
        bot.sendMessage(chatId, `Список сообществ: `);
    }
})