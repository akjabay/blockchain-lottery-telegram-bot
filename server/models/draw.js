const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const drawSchema = new Schema({
    prize: {
        type: String
    },
    walletAddress: {
        type: String
    },
},
    {
        timestamps: true,
    }
);


const draw = mongoose.model("Draw", drawSchema);

module.exports = draw;
