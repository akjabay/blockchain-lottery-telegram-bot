const { Markup } = require('telegraf');

module.exports = function (hooks) {
    hooks.bot.action('onSignup', async (ctx) => {
        try {
    
            ctx.session.step = 'signup';
            ctx.session.steps = [
                'inputWalletAddress'
            ];
            ctx.session.payloadStep = 'inputWalletAddress';
            return ctx.reply(
                hooks._textMnger.get('inputWalletAddress'),
                Markup.keyboard([
                    hooks._textMnger.get('back'),
                    hooks._textMnger.get('start'),
                ], {
                    columns: 1
                }).resize().oneTime()
            );
    
        } catch (error) {
            return hooks._onError({ ctx, error, markup: {} });
        }
    });
    
    hooks.bot.action('checkSignupStatus', async (ctx) => {
        try {
    
            hooks._functionalities.checkSignupStatus(hooks, ctx);
    
        } catch (error) {
            return hooks._onError({ ctx, error, markup: {} });
        }
    });
    
    hooks.bot.action(/^draws-(\d+)$/, async (ctx) => {
        try {

            const page = ctx.match[1] ? +ctx.match[1] : 1;
    
            hooks._functionalities.userAllDraws(hooks, ctx, page);
    
        } catch (error) {
            return hooks._onError({ ctx, error, markup: {} });
        }
    });

}
