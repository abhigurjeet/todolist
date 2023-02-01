const express = require("express");
const bodyParser = require("express");
const app = express();


app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine', 'ejs');
app.use(express.static('public'))


var day = new Date();
var gymExercise = [];
var arr = ["Buy Food", "Cook Food", "Eat Food"];
var options = { weekday: 'long', month: 'long', day: 'numeric' };
day = day.toLocaleString('en-us', options);


app.get('/', function (req, res) {
    res.render('list', { ListHeading: day, arr: arr });
});

app.get('/gymList', function (req, res) {
    res.render('list', { ListHeading: "Gym Todo List", arr: gymExercise });
});

app.post('/', function (req, res) {
    let str = req.body.item, count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == ' ')
            ++count;
    }
    if (count != str.length) {
        if (req.body.list === day) {
            arr.push(str);
            res.redirect('/');
        }
        else {
            gymExercise.push(str);
            res.redirect('/gymList');
        }
    }

});

app.listen(3000, function () {
    console.log("Running");
});