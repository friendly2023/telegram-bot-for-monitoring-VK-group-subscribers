import { token } from './serviceKey/telegramKey';
import TelegramApi from 'node-telegram-bot-api';
const bot: any = new TelegramApi(token, { polling: true })

