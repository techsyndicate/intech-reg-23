//Common
require('dotenv').config();

//Express
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

//Discord
const { Client, Intents } = require('discord.js');
const on_message = require('./Discord/on_message');
const IndexRouter = require('./Routers/index_router');
const ForgotRouter = require('./Routers/forgot');

const CallbackRouter = require('./Routers/callback');
const token = process.env.TOKEN;
const client = new Client({
    intents: [Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_INTEGRATIONS
    ]
});

app.use((req, res, next) => {
    if (req.headers.hasOwnProperty('x-forwarded-proto') && req.headers['x-forwarded-proto'].toString() !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect('https://' + req.headers.host + req.url);
    }
    else {
        next();
    }
})

//expose public
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use('/', IndexRouter);
app.use('/forgot', ForgotRouter);
app.use('/callback', CallbackRouter);

client.once('ready', c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});


//On a message call the on_message function
client.on("messageCreate", message => {
    message.content = message.content.toLowerCase();
    on_message(client, message);
})

client.login(token);