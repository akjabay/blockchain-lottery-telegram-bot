
const { TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_TOKEN_TEST } = process.env;
const db = require('../models/index');
const { Telegraf, Markup } = require('telegraf');
const textMnger = require('./textMnger/index.js');
const { mode = 'dev' } = require('../config');


module.exports = class Main {

    constructor({ hooks }) {
        this._db = db;
        this._hooks = hooks;
        this._sessions = [];
        this._bot;
        this._textMnger = textMnger;
        this._sessionCleaner();
    }

    get bot () {
        return this._bot;
    }
    get sessions () {
        return this._sessions;
    }
    set sessions (val) {
        this._sessions = val;
    }

    async _start({ child }) {

        try {
            const bot = new Telegraf(mode === 'dev' ? TELEGRAM_BOT_TOKEN_TEST : TELEGRAM_BOT_TOKEN);

            bot.use((ctx, next) => {
                console.time(`Processing update ${ctx.update.update_id}`);
                child._messagePusher({ ctx });
                ctx.session = this._getSesssion(ctx);
                next().then(() => {
                    this._setSession(ctx);
                }).catch((err) => {
                    this._setSession(ctx);
                    console.log(err);
                }) // runs next middleware
            });

            bot.start(async (ctx) => {
                const dbuser = await this._db["User"].findOne({
                    telegramId: ctx.from.id,
                });
                if (!dbuser) {
                    const newUser = new this._db["User"]({
                        telegramId: ctx.from.id,
                        isActive: true,
                    });
                    await newUser.save();
                }
                ctx.reply('⌨️...', Markup.keyboard([
                    this._textMnger.get('back'),
                    this._textMnger.get('start'),
                ], {
                    columns: 1
                }).resize().oneTime());

                const payloadData = ctx.message.text === '/start' ? '' : ctx.message.text.replace('/start ', '');
                const payload = payloadData ? payloadData : undefined;

                if (payload && dbuser && dbuser.status_auth === 'active') {

                    // do it with payload

                }

                if (child._adminIds.includes(`${ctx.from.id}`)) {
                    return this._replyWithAdminRoutes({ ctx });
                }

                return child._welcomeMessage({ ctx, dbuser });
            });

            bot.help((ctx) => {
                ctx.reply(this._textMnger.get('help'));
            });

            bot.on('text', (ctx) => {
                if (this._textMnger.findCommand(ctx.message.text) === 'back') {
                    this._removeSession(ctx);
                    if (child._adminIds.includes(`${ctx.from.id}`)) {
                        return this._replyWithAdminRoutes({ ctx });
                    }
                    return child._welcomeMessage({ ctx });
                } else if (this._textMnger.findCommand(ctx.message.text) === 'start') {
                    this._removeSession(ctx);
                    if (child._adminIds.includes(`${ctx.from.id}`)) {
                        return this._replyWithAdminRoutes({ ctx });
                    }
                    return child._welcomeMessage({ ctx });
                } else {
                    child._inputAnalyzer(ctx);
                }
            });

            bot.launch();

            this._bot = bot;

        } catch (error) {
            this._onError({
                ctx,
                error,
                markup: Markup.inlineKeyboard([
                    Markup.button.url('channel', 'https://t.me/megalottery'),
                ], {
                    columns: 1
                }).resize().oneTime()
            });
        }

    }

    _replyWithAdminRoutes ({ ctx }) {
        return ctx.reply(
            'admin permissions \n\n' +
            "💰 pick winner  /draw\n"+
            "💵 Deposit  /deposit.\n"+
            "📈 Statistics  /stats.\n"+
            "💰 Next Drawing  /nextDraw\n"+
            "💰 All Drawings  /allDraws\n", 
            Markup.inlineKeyboard([
                Markup.button.callback('users', 'users-1'),
            ], {
                columns: 1
            }).resize().oneTime()
        );
    }

    _onError({ ctx, error, markup, errMsg }) {
        const err = error ? new Error(error): '';
        errMsg = errMsg || err ? errMsg : 'error';
        const errorMessage = errMsg ? this._textMnger.get(errMsg) : err.message;
        return ctx.reply(errorMessage, markup);
    }

    _getSesssion(ctx) {
        const id = ctx.message
            ? ctx.message.from.id
            : (ctx.from
                ? ctx.from.id
                : '');
        if (id) {
            const session = this._sessions.find((s) => {
                return s.id == id;
            })
            if (session) {
                return session.value;
            } else {
                return {};
            }
        } else {
            return {};
        }

    }

    _setSession(ctx) {
        const id = ctx.message
            ? ctx.message.from.id
            : (ctx.from
                ? ctx.from.id
                : '');
        if (id && Object.keys(ctx.session).length > 0) {
            const index = this._sessions.findIndex((s) => {
                return s.id == id;
            });
            if (index > -1) {
                this._sessions[index].value = ctx.session;
                this._sessions[index].date = new Date().getTime();
            } else {
                this._sessions.push({ id: id , value: ctx.session, date: new Date().getTime() });
            }
        }
    }

    _removeSession(ctx) {
        const id = ctx.message
            ? ctx.message.from.id
            : (ctx.from
                ? ctx.from.id
                : '');
        if (id) {
            const newSessions = this._sessions.filter((s) => {
                return s.id != id
            });
            this.sessions = [...newSessions];
            ctx.session = { language: ctx.session.language };
        }
    }

    _sessionCleaner () {
        const _this = this;
        setInterval(() => {
            const now = new Date().getTime();
            const newSessions = _this._sessions.filter((s) => {
                return s.date && (now - s.date) < 1*60*60*1000;
            });
            this.sessions = [...newSessions];
        }, 1*60*60*1000);
    }

    _stop() {
        this._bot.stop();
    }
}
