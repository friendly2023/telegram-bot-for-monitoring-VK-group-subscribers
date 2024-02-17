import { token } from './serviceKey/telegramKey';
import TelegramApi from 'node-telegram-bot-api';
const bot: any = new TelegramApi(token, { polling: true });
import {creatingIdArray, creatingTitleArray} from './database/requestsToTableDB'

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
function outputMessage(){
    bot.on('message', async (msg: { text: string; chat: { id: number; }; from: { first_name: any; }; }) =>{
        // console.log(msg);
        const text: string = msg.text;
        const chatId: number = msg.chat.id;

        if (text === '/start') {
            return await bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name}`);
        }
        if (text === '/communities') {
            return await bot.sendMessage(chatId, `Список сообществ: `,
                await creatureArrayCommunities(chatId));
        }
    })
}

async function creatureArrayCommunities(chatId: number) {//подключение для кнопок '/communities'
    let buttonGeneratorArray:any = await searchFileTarget(chatId)
    if (buttonGeneratorArray.length == 0) {
        return { reply_markup: { inline_keyboard: [[{ text: '<<пусто>>', callback_data: `new` }],
                                                   [{ text: 'Добавить сообщество?', callback_data: `new` }]] } }
    }else{
        return { reply_markup: { inline_keyboard: buttonGeneratorArray } }
    }
}

async function searchFileTarget(chatId: number) {//поиск в бд+генерация массива для кнопки
    let idArray: string[] = await creatingIdArray(chatId)
    let titleArray: number[] = await creatingTitleArray(chatId)
    let buttonsArray:any = []
    for (let i = 0; i < idArray.length; i++) {
        buttonsArray.push([{ text: titleArray[i], callback_data: `groupId:${idArray[i]}` }])
    }
    return buttonsArray
}