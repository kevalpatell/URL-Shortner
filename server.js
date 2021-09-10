const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
const bodyParser = require("body-parser");
const connectDB = require("./db");
require("dotenv");
const app = express();


connectDB();

const host = process.env.HOST || "http://localhost";
const port = process.env.PORT || 5000;

// body parser
app.use(bodyParser.json());


app.use(express.urlencoded({ extended: false }));

// ejs view engine
app.set("view engine", "ejs")


app.get("/", async (req, res) => {
    try {
        const shortUrls = await ShortUrl.find();
        res.render("index", { shortUrls });
    } catch(error) {
        res.status(500).send({ error: error.message });
    }
});


app.post("/shortUrl", async (req, res) => {
    try {
        console.log(req.body);
        const url = await ShortUrl.create({
            fullUrl: req.body.fullUrl
        });
        console.log(url);
        res.status(200).send({ succss: true });
        // res.redirect("/");
    } catch(error) {
        res.status(500).send({ error: error.message });
    }
});

app.get("/:shortUrl", async (req, res) => {
    try {
        const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
        if(!shortUrl) {
            res.status(404).send({ error: "Page Not Found." });
        } 
        shortUrl.clicks++;
        shortUrl.save()

        console.log(shortUrl);
        res.redirect(shortUrl.fullUrl);
    } catch(error) {
        res.status(500).send({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server Up and Running on ${host}:${port}/`);
});