// contract address 0x86f158D42d21B8e140924f91de39C6Ef2b6c7547

// write bot first and bot have to work correctly


const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const cors = require("cors");
const path = require("path");
const { PORT, DATABASE, DATABASE_USERNAME, DATABASE_PASSWORD } = process.env;

app.set('view engine', 'ejs');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = PORT || 1717;

const mainRoutes = require("./routes/main.js");

app.use('/bot', mainRoutes);
app.use('/bot/public', express.static(path.resolve(__dirname, './public')));

app.use('/', express.static(path.resolve(__dirname, './dist')));

const { initBot } = require('./telegram/init.js');

mongoose.connect(
    DATABASE,
    {
        // user: DATABASE_USERNAME,
        // pass: DATABASE_PASSWORD,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
).then(function () {
        app.listen(port, () => {
            console.log('app is running on port: ' + port)
            initBot();
        })
    }
).catch((err) => {
    console.log(err);
});
