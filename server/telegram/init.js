const TelegramBot = require('./bot.js');

let bot;

module.exports.initBot = function initBot () {
    bot = new TelegramBot();
}

module.exports.bot = bot;