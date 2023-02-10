const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(express.static('public'))

//Setting up Mongoose to connect with MongoDB database
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/Todo');

//Schema
const listSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    }
});

//Models
const list = mongoose.model('list', listSchema);
const gymlist=mongoose.model('gymlist',listSchema);


var day = new Date();
var options = { weekday: 'long', month: 'long', day: 'numeric' };
day = day.toLocaleString('en-us', options);

//GET Requests
app.get('/', function (req, res) {
    list.find(function (err, arr) {
        if (err)
            console.log("ERROR");
        else
            res.render('list', { ListHeading: day, arr: arr });
    });
});

app.get('/gymList', function (req, res) {
    gymlist.find(function (err, arr) {
        if (err)
            console.log("ERROR");
        else 
            res.render('list', { ListHeading: "Gym Todo List", arr: arr });
    });
});


//POST Request for adding a new item
app.post('/', function (req, res) {
    let str = req.body.item, count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == ' ')
            ++count;
    }
    if (count != str.length) {
        if (req.body.list === day) {
            const nextitem=new list({item:str});
            list.insertMany([nextitem]);
            res.redirect('/');
        }
        else {
            const nextitem=new gymlist({item:str});
            gymlist.insertMany([nextitem]);
            res.redirect('/gymList');
        }
    }
});

app.listen(3000, function () {
    console.log("Running");
});