const express = require('express');
const router = express.Router();
const { Client } = require("@notionhq/client");
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})
const databaseId = process.env.NOTION_DATABASE_ID

router.get('/:id', async (req, res) => {
    var token = req.params.id;
    var rawdata = fs.readFileSync(path.resolve('./forgot.json'));
    var forgot = JSON.parse(rawdata)
    var user = forgot.forgots.find(user => user.id === token);
    if (user === undefined) {
        return res.send({ status: false, msg: "Invalid token!" })
    }
    var user_no = await getUserFromEmail(user.email);
    if (user_no === undefined) {
        return res.send({ status: false, msg: "User not found!" })
    }
    res.render('forgot', { token: token, name: user_no.properties.Name.title[0].plain_text })
});

router.post('/:id', async (req, res) => {
    var passwd = req.body.passwd;
    var token = req.params.id;
    var rawdata = fs.readFileSync(path.resolve('./forgot.json'));
    var forgot = JSON.parse(rawdata)
    var user = forgot.forgots.find(user => user.id === token);
    if (user === undefined) {
        return res.send({ status: false, msg: "Invalid token!" })
    }
    var user_no = await getUserFromEmail(user.email);
    if (user_no === undefined) {
        return res.send({ status: false, msg: "User not found!" })
    }
    await updatePassword(user_no, passwd);
    res.send({ status: true, msg: "Password updated!" })
})

const getUserFromEmail = async (email) => {
    //check if email in notion
    var response = await notion.databases.query({
        database_id: databaseId,
        filter: {
            or: [
                {
                    "property": 'Email',
                    "rich_text": {
                        "contains": email
                    }
                }
            ]
        }
    });
    response = await (JSON.parse(JSON.stringify(response)));
    console.log(response.results[0]);
    return response.results[0];
}

const updatePassword = async (user, password) => {
    console.log(password, saltRounds);
    return await notion.pages.update({
        page_id: user.id,
        properties: {
            "Password": {
                rich_text: [
                    {
                        text: {
                            content: (await bcrypt.hash(password, saltRounds)).toString()
                        }
                    }
                ]
            }
        }
    })
}

module.exports = router;