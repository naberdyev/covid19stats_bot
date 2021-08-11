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
    ///api2///
    

    try {
    data = await api.getReportsByCountries(ctx.message.text);

    let newCases;
    const covidData = async () => {
        let data = await api2.findData({ country: "russia" });
        newCases = data.todayCases;
    }
    ////api2 end////

    function numberWithSpaces(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    let country = numberWithSpaces(data[0][0].country);
    let cases = numberWithSpaces(data[0][0].cases);
    let deaths = numberWithSpaces(data[0][0].deaths);
    let recovered = numberWithSpaces(data[0][0].recovered);
    // let closedCases = numberWithSpaces(data[0][0].closed_cases[0].cases_which_had_an_outcome);
    // Случаев сегодня: ${closedCases}
    // console.log(data[0][0].closed_cases[0].cases_which_had_an_outcome);
    
    const formatData = `
Страна: ${country}
Cлучаи: ${cases}
Смертей: ${deaths}
Выздоровело: ${recovered}
Сегодня: ${newCases}
`;
    ctx.reply(formatData);
        } catch {
        console.log('Ошибка');
        ctx.reply('Ошибка. Такой страны не существует! Посмотрите /help');
        };
});
bot.launch()
console.log('Бот запущен');
