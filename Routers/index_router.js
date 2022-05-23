//Express
const express = require("express");
const IndexRouter = express.Router();

events = [[
    "App Development",
    "Web Development",
    "2D design",
    "UI Design"
], ["3D Design",
    "A/V editing",
    "Quiz",
    "Crossword"
], [
    "Cryptic Hunt",
    "Gaming",
    "Competitive Programming",
    "Photography"
], [
    "Audio Mixing",
    "Film Making",
    "Group Discussion",
    "Hardware"
]
];

IndexRouter.get("/", (req, res) => {
    res.render("index", { events });
});

IndexRouter.post("/register", (req, res) => {
});

module.exports = IndexRouter;
