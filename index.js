import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs", { data: "", time: "" });
});

app.post("/submit", (req, res) => {
    const postID = uuidv4();
    const currTime = new Date();
    const formattedDate = currTime.toLocaleDateString();
    const formattedTime = currTime.toLocaleTimeString();
    const timeString = `Posted on ${formattedDate} at ${formattedTime}`;
    res.json({
        data: req.body.post_text,
        time: timeString,
        ID : postID
    });
});

app.post("/save", (req, res) => {
    const postID = req.body.post_id;
    const postData = req.body.post_text;
    res.json({
        data: postData,
        ID : postID
    });
});

app.post("/cancel", (req, res) => {
    const postID = req.body.post_id;
    const postData = req.body.post_text;
    res.json({
        data: postData,
        ID: postID
    });
});

app.delete("/delete", (req, res) => {
    const postID = req.body.post_id;
    res.json({
        ID: postID
    })
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});