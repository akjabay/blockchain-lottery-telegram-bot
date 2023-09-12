const Main = require('./main');
const actions = require('./actions/index')
const functionalities = require('./functionalities/index');
const { ADMIN_IDS, FORCE_CHANNELS } = process.env;
const validator = require('validator').default;
const { Markup } = require('telegraf');

module.exports = class TelegramBot extends Main {
    constructor(args = []) {
        const { hooks } = args;
        super({ hooks });
        this._actions = actions;
        this._functionalities = functionalities;
        this._adminIds = ADMIN_IDS.split(',');
        this._forceChannels = FORCE_CHANNELS.split(',')
        this._newMessages = [];
        this._start({ child: this }).then(() => {
            this._init();
        }).catch((err) => {
            console.log(err)
        });
    }

    get hooks() {
        return super._hooks;
    }

    get bot() {
        return this._bot;
    }

    _init() {
        this._actions(this);
    }

    _welcomeMessage = async ({ ctx, dbuser }) => {
        try {
            const user = dbuser ? dbuser : await this._db["User"].findOne({
                telegramId: ctx.from.id,
            });
            return ctx.reply(
                    this._textMnger.get('welcome'),
                    Markup.inlineKeyboard([
                        // Markup.button.callback(this._textMnger.get('onSignup'), 'onSignup'),
                        Markup.button.url('channel', 'https://t.me/megalottery'),
                    ], {
                        columns: 1
                    }).resize().oneTime()
                ).then().catch((err) => {
                    const error = new Error(err);
                    console.log(error);
                });
        } catch (error) {
            return super._onError({ ctx, error, markup: {} });
        }
    }

    _loadMessagePrepare = (args = []) => {
        const { data, loadParams, complete } = args;
        return loadDetector.sendingDataDetector({ data, loadParams, complete });
    }

    _stepManager = (ctx) => {
        if (ctx.session.step === 'signup') {

            this._functionalities.userSignup(this, ctx);
        }
    }

    _commandManager = (ctx) => {
        if (ctx.message.text === '/stats') {

            this._functionalities.userStats(this, ctx);
        } else if (ctx.message.text === '/deposit') {
            
            this._functionalities.userDeposit(this, ctx);
        } else if (ctx.message.text === '/nextDraw') {
            
            this._functionalities.userNextDraw(this, ctx);
        } else if (ctx.message.text === '/allDraws') {
            
            this._functionalities.userAllDraws(this, ctx);
        } else if (ctx.message.text === '/draw') {
            
            this._functionalities.adminDraw(this, ctx);
        }
    }

    _inputAnalyzer = (ctx) => {

        if (!ctx.session.payloadStep) {

            if (ctx.session.isLoading) {
                return ctx.reply('⚠️\n\n you have running proccess.\n please wait more ...')
            }

            this._commandManager(ctx);

        } else {

            if (!ctx.session.payload) {
                ctx.session.payload = {};
            }

            const index = ctx.session.steps.findIndex((step) => {
                return ctx.session.payloadStep === step;
            });

            if (
                ctx.session.steps.length > 0 &&
                index > -1
            ) {
                ctx.session.payload[ctx.session.payloadStep] = ctx.message.text;
                if (index < ctx.session.steps.length - 1) {
                    ctx.session.payloadStep = ctx.session.steps[index + 1];
                    return ctx.reply(
                        this._textMnger.get(ctx.session.steps[index + 1]),
                        Markup.keyboard([
                            this._textMnger.get('back'),
                            this._textMnger.get('start'),
                        ], {
                            columns: 1
                        }).resize().oneTime()
                    ).then().catch((err) => {
                        const error = new Error(err);
                        console.log(error);
                    });
                } else if (index === ctx.session.steps.length - 1) {

                    this._stepManager(ctx);
                }
            }

        }
    }

    async sendMessage(args = []) {
        const { message, to, link, argParams = {} } = args;
        if (this._bot) {
            try {
                const fixedText = message.replace(/\-/g, '\\-')
                    .replace(/\#/g, '\\#').replace(/\./g, '\\.')
                    .replace(/\)/g, '\\)').replace(/\(/g, '\\(')
                    .replace(/\!/g, '\\!').replace(/\=/g, '\\=')
                    .replace(/\_/g, '\\_');

                const params = { parse_mode: 'MarkdownV2' };
                Object.keys(argParams).forEach((key) => {
                    params[key] = argParams[key];
                })
                const txt = fixedText + (link ? link : '');
                await this._bot.telegram.sendMessage(to, txt, params);

            } catch (error) {
                console.log('error: ', error)
            }
        }
    }

    async _isJoinedToChannels ({ user = {} } = []) {
        if (!user.id) return false;

        try {

            const joinedArray = [];

            for await (const channelId of this._forceChannels) {

                const result = await this._bot.telegram.getChatMember(channelId, user.telegramId);

                if (result && result.user && ['member', 'creator', 'admin', 'administrator'].includes(result.status)) joinedArray.push(true);

            }

            return joinedArray.length === this._forceChannels.length;
    
        } catch (error) {
            return false;
        }

    }

    _checkLimitations ({ user = {} } = []) {
        if (!user.id) return { validation: false, updatedUser: user };
        const time = new Date();
        const timestamp = time.getTime();
        if (user.role === 'admin') return { validation: true, updatedUser: user, isPro: true };
        if (user.proUser && user.proUser.status && timestamp < new Date(user.proUser.expires).getTime()) return { validation: true, updatedUser: user, isPro: true };
        const lastUsageTime = new Date(user.limitations.lastUsageTime);
        const monthOfNow = time.getMonth();
        const monthOfUsage = lastUsageTime.getMonth();
        lastUsageTime.setHours(24,0,0,0);
        const usageTS = lastUsageTime.getTime();

        const isDailyTimeValid = (timestamp - usageTS) > 0 || user.limitations.dailyUsage < user.limitations.daily;
        const isMonthlyTimeValid = monthOfNow > monthOfUsage || user.limitations.monthlyUsage < user.limitations.monthly;
        if ((timestamp - usageTS) > 0) user.limitations.dailyUsage = 0;
        if (monthOfNow > monthOfUsage) user.limitations.monthlyUsage = 0;
        return {
            validation : isDailyTimeValid && isMonthlyTimeValid,
            updatedUser: user,
        }
    }

    async _updateLimitations ({ user = {} } = []) {
        if (!user.id) return;
        try {
            const now = new Date();
            user.limitations.lastUsageTime = now;
            user.limitations.dailyUsage = user.limitations.dailyUsage + 1;
            user.limitations.monthlyUsage = user.limitations.monthlyUsage + 1;
            await this._db["User"].findByIdAndUpdate(user.id, {
                limitations: user.limitations,
            });
        } catch (error) {
            console.log(error)
        }

    }

    _validateInput(ctx) {

        let isValidated = false;

        if ((ctx.session.payloadStep).toLowerCase().includes('walletaddress')) {
            const isWallet = ctx.message.text.length === 42 && ctx.message.text.slice(0, 2) === '0x';
            isValidated = isWallet;
        } else if ((ctx.session.payloadStep).toLowerCase().includes('address')) {
            isValidated = !validator.isEmpty(ctx.message.text);
        } else if ((ctx.session.payloadStep).toLowerCase().includes('email')) {
            isValidated = validator.isEmail(ctx.message.text);
        } else if ((ctx.session.payloadStep).toLowerCase().includes('phone')) {
            isValidated = validator.isNumeric(ctx.message.text);
        } else if ((ctx.session.payloadStep).toLowerCase().includes('name')) {
            isValidated = !validator.isEmpty(ctx.message.text);
        }

        return isValidated;

    }

    _messagePusher({ ctx = {} }) {
        if (ctx.update && ctx.update.channel_post) {
            this._newMessages.push(ctx.update);
        }
    }


}