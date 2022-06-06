const express = require('express');
const router = express.Router();
const { Client } = require("@notionhq/client");
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const ejs = require("ejs");

router.get('/:id', (req,res)=>{
    var token = req.params.id;

    var rawdata = fs.readFileSync(path.resolve('./forgot.json'));
    var forgot = JSON.parse(rawdata)
    var user = forgot.forgots.find(user => user.id === token);
    if(user === undefined){
        return res.send({status: false, msg: "Invalid token!"})
    }
    res.render('forgot', {token: token})
})

router.post('/:id', async (req,res)=>{
    var passwd = req.body.password;
    var token = req.params.id;
    var rawdata = fs.readFileSync(path.resolve('./forgot.json'));
    var forgot = JSON.parse(rawdata)
    var user = forgot.forgots.find(user => user.id === token);
    if(user === undefined){
        return res.send({status: false, msg: "Invalid token!"})
    }
    var user_no = await getUserFromEmail(user.email);
    if(user_no === undefined){
        return res.send({status: false, msg: "User not found!"})
    }
    res.render('forgotem', { token: token, name: user_no.properties.Name.title[0].plain_text })
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


module.exports = router;