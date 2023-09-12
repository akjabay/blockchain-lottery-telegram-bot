const { Markup } = require('telegraf');
const adminActions = require('./admin.js')
const userActions = require('./user.js')

module.exports = function (hooks) {
    adminActions(hooks);
    userActions(hooks);
}