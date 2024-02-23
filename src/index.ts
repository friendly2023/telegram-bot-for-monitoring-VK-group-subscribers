import { token } from './serviceKey/telegramKey';
import TelegramApi from 'node-telegram-bot-api';
const bot: any = new TelegramApi(token, { polling: true });
import { creatingIdArray, creatingTitleArray, creatingTitleArrayTime } from './database/requestsToTableDB'
import { writeToFileSQL } from './database/writingToTableDB'
import { delToFileSQL } from './database/delToTableDB'
import { comparisonCommunitiesByTime } from './database/comparisonRequestsToTableDB'

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
    bot.on('message', async (msg: { text: string; chat: { id: number; }; from: { first_name: string; }; }) => {
        // console.log(msg);
        const text: string = msg.text;
        const chatId: number = msg.chat.id;

        if (text === '/start') {
            return await bot.sendMessage(chatId, `Добро пожаловать ${msg.from.first_name}`);
        }
        if (text === '/communities') {
            return await bot.sendMessage(chatId, `Список сообществ: `,
                await creatureArrayCommunities(chatId, 'groupId:'));
        }
        if (text === '/new') {
            return await bot.sendMessage(chatId, `Пришлите ссылку на сообщество которое хотите добавить`);
        }
        if (text === '/del') {
            return await bot.sendMessage(chatId, `Сообщества для удаления: `,
                await creatureArrayCommunities(chatId, 'del:'));
        }
        if (text.slice(0, 15) == 'https://vk.com/') {
            let groupId: string = text.slice(15);
            let firstName: string = msg.from.first_name
            return await writeToFileSQL(chatId, firstName, groupId)
                .then(result => bot.sendMessage(chatId, `${result}`));
        }
        return await bot.sendMessage(chatId, `Хз о чем ты..`);
    })

    bot.on('callback_query', async (msg: { message: { chat: { id: number; }; }; data: string; }) => {
        const chatId: number = msg.message.chat.id;
        const text: string = msg.data;
        if (text.slice(0, 8) == 'groupId:') {
            const communityId: string = text.slice(8);
            return await bot.sendMessage(chatId, `Выберите время для сравнения: `,
                await creatureArrayTimeCommunities(communityId));
        } else if (text.slice(0, 5) == 'time:') {
            const communityIdTime: string = text.slice(5);
            const time: string = text.slice(-20);
            const communityId: string = communityIdTime.slice(0, -21);
            return await comparisonCommunitiesByTime(communityId, time)
                .then(result => bot.sendMessage(chatId, `${result}`));
        } else if (text.slice(0, 4) == 'new') {
            return await bot.sendMessage(chatId, `Пришлите ссылку на сообщество которое хотите добавить`);
        } else if (text.slice(0, 4) == 'del:') {
            const communityId: string = text.slice(4);
            return await delToFileSQL(chatId, communityId)
                .then(result => bot.sendMessage(chatId, `${result}`));
        } else {
            console.log('Ответа на запрос не найден')
        }
    })
}

async function creatureArrayCommunities(chatId: number, option: string): Promise<any> {//подключение для кнопок '/communities' и '/del'
    let buttonGeneratorArray: any = await searchFileTarget(chatId, option)
    if (buttonGeneratorArray.length == 0) {
        return {
            reply_markup: {
                inline_keyboard: [[{ text: '<<пусто>>', callback_data: `new` }],
                [{ text: 'Добавить сообщество?', callback_data: `new` }]]
            }
        }
    } else {
        return { reply_markup: { inline_keyboard: buttonGeneratorArray } }
    }
}

async function searchFileTarget(chatId: number, option: string): Promise<any[]> {//поиск в бд+генерация массива для кнопки
    let idArray: string[] = await creatingIdArray(chatId)
    let titleArray: number[] = await creatingTitleArray(chatId)
    let buttonsArray: any[] = []
    for (let i = 0; i < idArray.length; i++) {
        buttonsArray.push([{ text: titleArray[i], callback_data: `${option}${idArray[i]}` }])
    }
    return buttonsArray
}

async function creatureArrayTimeCommunities(communityId: string): Promise<any> {//подключение для кнопок ответов на кнопки '/communities'
    return { reply_markup: { inline_keyboard: await requestTime(communityId) } }
}

async function requestTime(communityId: string) {
    let timeArray: string[] = await creatingTitleArrayTime(communityId)
    let buttonsArray: any = []
    for (let i = 0; i < timeArray.length; i++) {
        buttonsArray.push([{ text: timeArray[i], callback_data: `time:${communityId}:${timeArray[i]}` }])
    }
    return buttonsArray
}