const { bot } = require('../telegram/init.js');

module.exports.getIndex = async (req, res, next) => {
    const body = Object.keys(req.query).length === 0 ? req.body : req.query;

    const message = body.message;

    try {

        return res.render('index', {
            message,
        });

    } catch (error) {
        const err = new Error(error);
        console.log(err);
        return res.render('error', {
            error: err
        })
    };
}
