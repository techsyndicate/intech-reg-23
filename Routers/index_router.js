//Express
const express = require("express");
const IndexRouter = express.Router();

events = [
    "AppD",
    "WebD",
    "2D design",
    "UI Design",
    "3D Design",
    "A / V editing",
    "Quiz",
    "Crossword",
    "Cryptic Hunt",
    "Gaming",
    "Competitive Programming",
    "Photography",
    "Audio mixing",
    "Film Making",
    "GD",
    "Hardware",
];

IndexRouter.get("/", (req, res) => {
    res.render("index", {events});
});

module.exports = IndexRouter;
