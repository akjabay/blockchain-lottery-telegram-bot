const { Markup } = require('telegraf');
const Client = require('../../blockchain/client');
const client = new Client();

const isAdmin = (hooks, ctx) => {
    return hooks._adminIds.includes(`${ctx.from.id}`);
}


module.exports.userStats = async (hooks, ctx) => {

    const user = await hooks._db['User'].findOne({
        telegramId: ctx.from.id
    })

    if (!user.walletAddress) {
        ctx.session.step = 'signup';
        ctx.session.steps = [
            'inputWalletAddress'
        ];
        ctx.session.payloadStep = 'inputWalletAddress';
        hooks._setSession(ctx);

        return ctx.reply('Please enter your wallet address');
    }

    const players = await client.getPlayers();
    const total = Object.values(players).reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    },0);

    const playInfo = `📈 Your Deposited amount: \n`+
    `${user.walletAddress.slice(0, 4)}...${user.walletAddress.slice(-2)}: ${players[user.walletAddress] ? players[user.walletAddress] : 0}\n\n` + 
    `💰 Total draw balance: \n${total}\n\n` + 
    `✅ All players: \n${Object.keys(players).map((v) => v.slice(0, 4) + '...' + v.slice(-2) + ': ' + players[v]).join('\n')}\n\n`;

    return ctx.reply(playInfo);
}

module.exports.userDeposit = async (hooks, ctx) => {

    const info = `✅ Click here to deposit to contract`;

    return ctx.reply(
        info,
        Markup.inlineKeyboard([
            Markup.button.url('Mobile Dapp', 'https://link.trustwallet.com/open_url?coin_id=20000714&url=https://main-dapp.onrender.com/'),
            Markup.button.url('Desktop Dapp', 'https://main-dapp.onrender.com/'),
        ], {
            columns: 1
        }).resize().oneTime()
    );
}

module.exports.userNextDraw = async (hooks, ctx) => {

    const drawTime = await client.getDrawTime();

    const info = `Draw Time: ${drawTime}\n\n`;

    return ctx.reply(info);
}

module.exports.userAllDraws = async (hooks, ctx, page) => {

    page = page ? +page : 1;
    const offset = (page - 1) * 10;
    const draws = await hooks._db["Draw"].find().skip(offset).limit(10);

    const drawsInfo = draws.length > 0
        ? `All draws: ${draws.map((v) => v.walletAddress + ': ' + v.prize).join('\n')}\n\n`
        : 'There is no data in this page';

    const keyboardParams = [];
        page > 1 ? keyboardParams.push(Markup.button.callback('draws-page-' + (page - 1), 'draws-' + (page - 1))) : "";
        keyboardParams.push(Markup.button.callback('draws-page-' + page, 'draws-' + (page + 1)));

    return ctx.reply(
        drawsInfo,
        Markup.inlineKeyboard(keyboardParams, {
            columns: 1
        }).resize().oneTime()
    );
}

module.exports.adminDraw = async (hooks, ctx) => {

    if (!isAdmin(hooks, ctx)) {
        return;
    }

    const players = await client.getPlayers();
    const total = Object.values(players).reduce((accumulator, currentValue) => {
        return accumulator + currentValue
    },0);

    const result = await client.draw();

    if (result) {
        const users = await hooks._db["User"].find();
        const info = "🎉Congratulations to Our User🎉\n"+
        "with this tx hash: \n" +
        "https://testnet.ftmscan.com/tx/" + result + "\n" +
        "🎁 Won " + total;
        users.forEach((user) => {
            hooks._bot.telegram.sendMessage(user.telegramId, info)
            .then()
            .catch((err) => {console.log(err)});
        });
        return ctx.reply(info);
    }

    return ctx.reply('error on draw. please try again later');

}

module.exports.userSignup = async (hooks, ctx) => {

    if (!ctx.session.payload) {
        ctx.session.payload = {};
    }

    const index = ctx.session.steps.findIndex((step) => {
        return ctx.session.payloadStep === step;
    });

    if (
        ctx.session.steps.length > 0 &&
        index > -1 &&
        index < ctx.session.steps.length - 1
    ) {
        ctx.session.payload[ctx.session.payloadStep] = ctx.message.text;
        ctx.session.payloadStep = ctx.session.steps[index + 1];
        return ctx.reply(
            hooks._textMnger.get(ctx.session.steps[index + 1]),
            Markup.keyboard([
                hooks._textMnger.get('back'),
                hooks._textMnger.get('start'),
            ], {
                columns: 1
            }).resize().oneTime()
        );
    } else if (index === ctx.session.steps.length - 1) {

        if (!hooks._validateInput(ctx)) {
            return ctx.reply('please enter correct wallet address')
        }

        const user = await hooks._db["User"].findOneAndUpdate({
            telegramId: ctx.from.id,
        }, {
            walletAddress: ctx.session.payload['inputWalletAddress'],
            status_auth: 'active',
        }, { new: true });

        hooks._removeSession(ctx);

        return ctx.reply(
            '✅ your wallet address has been saved.\n\n '+
            'wallet address: '+user.walletAddress+'\n\n'+
            'now you can use this bot.',
        )
    }
}
