require('dotenv').config()
const { Telegraf } = require('telegraf')
const api = require('covid19-api')
const Markup = require('telegraf').Markup
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name}!
Узнай статистику по коронавирусу.
Введи на английском название страны и получи статистику.
Посмотреть весь список стран можно командой /help
`, Markup.keyboard([
    ['US', 'Russia'],
    ['Ukraine', 'Kazakhstan']
    ]).resize()
    )
);

bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
    let data = {};

    try {
    data = await api.getReportsByCountries(ctx.message.text);
    
    const formatData = `
Страна: ${data[0][0].country}
Cлучаи: ${data[0][0].NewCases}
Смертей: ${data[0][0].deaths}
Выздоровело: ${data[0][0].recovered} 
`;
    ctx.reply(formatData);
        } catch {
        console.log('Ошибка');
        ctx.reply('Ошибка. Такой страны не существует! Посмотрите /help');
        };
});
bot.launch()
console.log('Бот запущен');

