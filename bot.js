require('dotenv').config()
const { Telegraf } = require('telegraf')
const api = require('corona-info')
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

    ///api///
    const covidData = async () => {
        let data = await api.findData({ country: ctx.message.text });
        return data;
    };
    ////api////
    
  
    async function go() {
        let data = await covidData();
        const formatData = `
Данные на ${data.updatedDate} в ${data.countryName}:
**Всего случаев:** ${data.cases}
**Всего выздоровело:** ${data.recovered}
**Всего смертей:** ${data.deaths}
**Заболело сегодня:** ${data.todayCases}
**Выздоровело сегодня:** ${data.todayRecovered}
**Умерло сегодня:** ${data.todayDeaths}
`;
ctx.reply(formatData);
ctx.replyWithPhoto({ url: data.countryFlag });
    }
    go()
        } catch {
        console.log('Ошибка');
        ctx.reply('Ошибка. Такой страны не существует! Посмотрите /help');
        };
});
bot.launch()
console.log('Бот запущен');
