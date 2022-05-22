//Express
const express = require('express');
const IndexRouter = express.Router();

IndexRouter.get('/', (req, res)=>{
    res.render('index')
})

module.exports = IndexRouter;