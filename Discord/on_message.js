module.exports = (client, message) => {
    if (!message.author.bot) {
        if (message.content.startsWith('ts ')) {
            message.content = message.content.slice(3);
            if (message.content.length > 0) {
                command(client, message);
                console.log(message.content);
            }
        }
    };
}

function command(client, message) {
    if (message.content.startsWith('verify')) {
        console.log(message.content)
        token = message.content.slice(7);
        if (token.length == 0) {
            message.react('❌');
            return;
        }
        //dm the user that they are verified
        message.react('✅');
        message.author.send('You are verified!');
    }
}