import express from "express";
import dateFormat from "dateformat";
import {connect, Schema, model} from "mongoose";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const day = dateFormat(new Date(), "dddd, mmmm dS");
// dont forget to add the following to your .env before deploying
const mongoDB = "mongodb+srv://<YOUR CLUSTER CONNECTION STRING>";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('DB is connected'))
.catch(err => console.log(err)); 

const itemsSchema = new Schema ({ name: String,});
const Item = model ("Item", itemsSchema);
const listSchema = new Schema ({name: String, items:[itemsSchema]});
const List = model ("List", listSchema);

app.get("/", async (req, res,) => {
    const itemList = await Item.find({});
    if (itemList.length === 0){
        let itemsList = await Item.insertMany([
            { name: "Welcome to your to-do-list"},
            { name: "Hit the + button to add a new item"},
            { name: "<-- Click here to delete an item>"}
            ]);
            res.redirect("/");
    } else {
    res.render("index.ejs", {items: itemList, date: day})
}});

app.get("/work", async (req, res) => {
    const itemList = await List.find({});
    if (itemList.length === 0){
        let itemsList = await List.insertMany([
            { name: "Welcome to your to-do-list"},
            { name: "Hit the + button to add a new item"},
            { name: "<-- Click here to delete an item>"}
            ]);
            res.redirect("/work");
    } else {
    res.render("work.ejs", {items: itemList, date: day})
}});

app.post("/", async (req, res) => {
    let item = new Item({name: req.body["inputBox"]});
    const wait = await item.save();
    const itemList = await Item.find({});
    res.render("index.ejs", {items: itemList, date: day,});
});

app.post("/work", async (req, res) => {
    let item = new List({name: req.body["inputBox"]});
    const wait = await item.save();
    const itemList = await List.find({});
    res.render("index.ejs", {items: itemList, date: day,});
});

app.post("/delete", async (req, res) => {
    const checkItemId = req.body.checkbox;
    let item = await Item.findOneAndDelete({_id: req.body.checkbox});
    res.redirect("/");
});

app.post("/remove", async (req, res) => {
    const checkItemId = req.body.checkbox;
    let item = await List.findOneAndDelete({_id: req.body.checkbox});
    res.redirect("/work");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);});
