const { Markup } = require('telegraf');

const isAdmin = (hooks, ctx) => {
    return hooks._adminIds.includes(`${ctx.from.id}`);
}

module.exports = function (hooks) {

    hooks.bot.action(/^users-(\d+)$/, async (ctx) => {
        if (!isAdmin(hooks, ctx)) {
            return;
        }
        try {
            const page = ctx.match[1] ? +ctx.match[1] : 1;
            const pagination = {
                skip: page ? (page - 1) * 10 : 0,
                limit: 10,
            }
            const users = await hooks._db["User"].find({}).skip(pagination.skip).limit(pagination.limit).exec();
            const usersInfo = users.length > 0 ? users.map((u, i) => {
                return i + 1 + '-' + u.id + '- telegramId: ' + u.telegramId + (u.phone ? '-' + u.phone : '');
            }) : ['there is no data in this page'];

            const keyboardParams = [];
            page > 1 ? keyboardParams.push(Markup.button.callback('users-page-' + (page - 1), 'users-' + (page - 1))) : "";
            keyboardParams.push(Markup.button.callback('users-page-' + page, 'users-' + (page + 1)));

            return ctx.reply(
                usersInfo.join('\n') + '\n\n',
                Markup.inlineKeyboard(keyboardParams, {
                    columns: 1
                }).resize().oneTime()
            )

        } catch (error) {
            return hooks._onError({ ctx, error, markup: {} });
        }
    })

    hooks.bot.action(/^draws-(\d+)$/, async (ctx) => {
        if (!isAdmin(hooks, ctx)) {
            return;
        }
        try {
            const page = ctx.match[1] ? +ctx.match[1] : 1;
            const pagination = {
                skip: page ? (page - 1) * 10 : 0,
                limit: 10,
            }
            const draws = await hooks._db['Draw'].find({}).skip(pagination.skip).limit(pagination.limit).exec();
            const drawsInfo = draws.length > 0 ? draws.map((u, i) => {
                return i + 1 + '-' + u.id + '-';
            }) : ['there is no data in this page'];

            const keyboardParams = [];
            page > 1 ? keyboardParams.push(Markup.button.callback('draws-page-' + (page - 1), 'draws-' + (page - 1))) : "";
            keyboardParams.push(Markup.button.callback('draws-page-' + page, 'draws-' + (page + 1)));

            return ctx.reply(
                drawsInfo.join('\n') + '\n\n',
                Markup.inlineKeyboard(keyboardParams, {
                    columns: 1
                }).resize().oneTime()
            )

        } catch (error) {
            return hooks._onError({ ctx, error, markup: {} });
        }
    })
}