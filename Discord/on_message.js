const { Client } = require("@notionhq/client");

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})
const databaseId = process.env.NOTION_DATABASE_ID


module.exports = async (client, message) => {
    if (!message.author.bot) {
        if (message.content.startsWith('ts ')) {
            message.content = message.content.slice(3);
            if (message.content.length > 0) {
                command(client, message);
            }
        }
    };
}

async function command(client, message) {
    if (message.content.startsWith('verify')) {
        token = message.content.slice(7);
        if (token.length == 0) {
            await message.react('❌');
            await message.author.send('Please use a valid token!');
            await message.delete();
            return;
        }

        var response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                or: [
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
            await message.author.send('Invalid token!');
            await message.delete();
            return;
        }
        var properties = (response.results[0].properties);

        try {
            await message.member.setNickname(properties.Name.rich_text[0].text.content + ' | ' + properties.grade.rich_text[0].text.content + properties.section.rich_text[0].text.content);
        } catch (error) {
            console.log(error)
        }
        let role = await message.guild.roles.cache.find(r => r.name == 'participant')
        await message.react('✅');
        await message.author.send('You are verified!');
        await message.member.roles.add(role);
        await message.delete();
    }
}

function getAge(birthDate) {
    var now = new Date();

    function isLeap(year) {
        return year % 4 == 0 && (year % 100 != 0 || year % 400 == 0);
    }

    // days since the birthdate    
    var days = Math.floor((now.getTime() - birthDate.getTime()) / 1000 / 60 / 60 / 24);
    var age = 0;
    // iterate the years
    for (var y = birthDate.getFullYear(); y <= now.getFullYear(); y++) {
        var daysInYear = isLeap(y) ? 366 : 365;
        if (days >= daysInYear) {
            days -= daysInYear;
            age++;
            // increment the age only if there are available enough days for the year.
        }
    }
    return age;
}
