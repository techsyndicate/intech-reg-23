const { Client } = require("@notionhq/client");

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})
const databaseId = process.env.NOTION_DATABASE_ID


module.exports = async (client, message) => {
    if (!message.author.bot) {
        console.log(message.channel.id)
        if (message.channel.id == '1110609203208388698') {
            if (message.content.startsWith('ts ')) {
                message.content = message.content.slice(3);
                if (message.content.length > 0) {
                    command(client, message);
                }
            }
        }
    };
}

async function command(client, message) {
    if (message.content.startsWith('verify')) {
        token = message.content.slice(7);
        if (token.length == 0) {
            await message.react('❌');
            await sendMessage(message,'Please use a valid token!').then(() => {return});
            await message.delete();
            return;
        }

        var response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        "property": 'Discord Secret',
                        "rich_text": {
                            "contains": token
                        }
                    }
                ]
            }
        });
        console.log(JSON.parse(JSON.stringify(response)));
        if (!response.results.length > 0) {
            await message.react('❌');
            await sendMessage(message, 'Invalid token!').then(() => { return });
            await message.delete();
            return;
        }
        var properties = (await response.results[0].properties);
        console.log(properties.Name.title[0].text.content + ' | ' + properties.grade.rich_text[0].text.content + properties.section.rich_text[0].text.content)
        try {
            await message.member.setNickname(properties.Name.title[0].text.content + ' | ' + properties.grade.rich_text[0].text.content + properties.section.rich_text[0].text.content);
        } catch (error) {
            console.log(error)
        }
        let role = await message.guild.roles.cache.find(r => r.name == 'participant')
        await message.react('✅');
        await sendMessage(message, 'You are verified!').then(() => { return });
        await message.member.roles.add(role);
        await message.delete();
    }
}

function sendMessage(message, content) {
    new Promise((resolve, reject) => {
        try {
            message.author.send(content);
            resolve();
        }
        catch (error) {
            message.channel.send("You have disabled DMs from server members. Please enable them and resend verification code.");
            resolve();
        }
    })
}