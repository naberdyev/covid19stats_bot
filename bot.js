require('dotenv').config()
const { Telegraf } = require('telegraf')
const api = require('covid19-api')
const api2 = require('corona-info')
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

    ///api2///
    const covidData = async () => {
        let data = await api2.findData({ country: ctx.message.text });
        return data;
    };
    ////api2 end////
    
  
    async function go() {
        let data = await covidData();
        const formatData = `
Данные на ${data.updatedDate} в ${data.countryName} ${data.countryFlag}:
Всего случаев: ${data.cases}
Всего выздоровело: ${data.recovered}
Всего смертей: ${data.deaths}
Заболело: ${data.todayCases}
Выздоровело: ${data.todayRecovered}
Умерло: ${data.todayDeaths}
`;
ctx.reply(formatData);
    }
    go()
        } catch {
        console.log('Ошибка');
        ctx.reply('Ошибка. Такой страны не существует! Посмотрите /help');
        };
});
bot.launch()
console.log('Бот запущен');
