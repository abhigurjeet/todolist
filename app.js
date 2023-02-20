const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const app = express();


app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(express.static('public'))

//Setting up Mongoose to connect with MongoDB database
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://abhigurjeet:Test1234@cluster0.z56sq9e.mongodb.net/Todo");
//mongoose.connect('mongodb://127.0.0.1:27017/Todo');

//Schema
const listSchema = new mongoose.Schema({
    name: String,
    item: [String]
});

//Models
const list = mongoose.model('list', listSchema);

//add 1st document / Home document
let day = 'Today';
const base = new list({ name: day, item: [] });
list.find({ name: 'Today' }, function (err, arr) {
    if (err)
        console.log("ERROR");
    else {
        if (arr.length == 0)
            list.insertMany([base]);
    }
});


//GET Requests
app.get('/' || '/Today', function (req, res) {
    list.find({ name: 'Today' }, function (err, ptr) {
        if (err)
            console.log("ERROR");
        else {
            console.log(ptr[0].item);
            res.render('list', { ListHeading: ptr[0].name, arr: ptr[0].item });
        }
    });
});
app.get('/:val', function (req, res) {
    list.find({ name: req.params.val }, function (err, ptr) {
        if (err)
            console.log("ERROR");
        else {
            if (ptr.length == 0) {
                const doc = new list({ name: req.params.val, item: [] });
                list.insertMany([doc]);
                res.redirect('/' + req.params.val);
            }
            else
                res.render('list', { ListHeading: ptr[0].name, arr: ptr[0].item });
        }
    });
});


//POST Request for adding a new item
app.post('/', function (req, res) {

    let str = req.body.item, count = 0, name = req.body.list;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == ' ')
            ++count;
    }
    if (count != str.length) {
        list.findOneAndUpdate({ name: req.body.list }, { $push: { item: str } }, function (error, success) {
            if (error)
                console.log(error);
        });
        res.redirect('/' + name);
    }
});
app.post('/delete', function (req, res) {
    let tempStr = req.body.ind, name = '', ind = 0;
    for (let i = 0; i < tempStr.length; i++) {
        if (tempStr[i] - '0' < 10 && tempStr[i] - '0' >= 0)
            ind = ind * 10 + (tempStr[i] - '0');
        else {
            name = tempStr.substr(i);
            break;
        }
    }
    list.find({ name: name }, function (err, arr) {
        if (err)
            console.log("error");
        else {
            list.findOneAndUpdate({ name: name }, { $pull: { item:  arr[0].item[ind] } }, function (error, success) {
                if (error)
                    console.log(error);
                else{
                    res.redirect('/'+name);
                }
            });
        }
    })
});

app.listen(3000, function () {
    console.log("Running");
});