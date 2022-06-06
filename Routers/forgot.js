const express = require('express');
const router = express.Router();
const { Client } = require("@notionhq/client");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const ejs = require("ejs");

// Initializing a client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})
const databaseId = process.env.NOTION_DATABASE_ID

router.get('/test', (req, res) => {
    res.render('forgotem', {name: 'test', token: '123456789'})
})

const writeEmail = async (token, email) => {
    let rawdata = fs.readFileSync(path.resolve('./forgot.json'));
    let forgot = await JSON.parse(rawdata);

    forgot.forgots.push({
        "id": token,
        "email": email
    })

    fs.writeFileSync(path.resolve('./forgot.json'),
        JSON.stringify(forgot, null, 2));
    return (forgot);
}

router.get("/:id", async (req, res) => {
    var email = req.params.id;
    var user = await getUserFromEmail(email);
    if (user == undefined) {
        return res.send({ status: false, msg: "Email entered is not a valid email! Please try again." });
    }

    //generate uuid, add to file, send email
    var token = uuidv4();
    writeEmail(token, email);

    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: email,
        subject: 'InTech Forgot Password',
        html: await renderFile('./views/forgotem.ejs', { token, name: user.properties.Name.title[0].plain_text })
    };
    console.log(user.properties.Name.title[0].plain_text);

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.send({ success: false, msg: 'there was a problem sending the email!' });
        } else {
            res.send({ success: true, msg: 'email-send', info });
        }
    });
})


// Transport To Send Mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    secureConnection: false,
    port: 465,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD // naturally, replace both with your real credentials or an application-specific password
    }, tls: {
        rejectUnauthorized: false
    }
});
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

const renderFile = (file, data) => {
    return new Promise(resolve => {
        ejs.renderFile(file, data, (err, result) => {
            if (err) {
                logger.error(err);
            }
            resolve(result);
        });
    });
}


module.exports = router;