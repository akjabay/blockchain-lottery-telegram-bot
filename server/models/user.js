const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    phone: {
        type: String
    },
    walletAddress: {
        type: String
    },
    password: {
        type: String
    },
    telegramId: {
        type: String,
        require: true,
    },
    invitedByUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    limitations: {
        daily: {
            type: Number,
            default: 2,
            require: true,
        },
        dailyUsage: {
            type: Number,
            default: 0,
            require: true,
        },
        monthly: {
            type: Number,
            default: 10,
            require: true,
        },
        monthlyUsage: {
            type: Number,
            default: 0,
            require: true,
        },
        lastUsageTime: {
            type: Date,
            default: 0
        },
    },
    proUser: {
        status: {
            type: Boolean
        },
        expires: {
            type: Date
        }
    },
    status_auth: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    role: {
        type: String,
        enum: ['normal', 'announcer', 'admin'],
        default: 'normal',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
},
    {
        timestamps: true,
    }
);


const user = mongoose.model("User", userSchema);

module.exports = user;