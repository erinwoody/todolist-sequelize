//IMPORTS
const express = require("express");
const mustacheExpress = require("mustache-express");
const expressValidator = require("express-validator");
const bodyParser = require("body-parser");
const path = require("path");
const models = require("./models");
const port = process.env.PORT || 8000;
const app = express();

const todo = models.todo;

//MIDDLEWARE
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(express.static(path.join(__dirname, "./public")));
app.use(bodyParser.urlencoded({ extended: false }));

//ROUTES
app.get("/", (req, res) => {
    todo.findAll().then(function (todos) {
        res.render('index', {
            todos: todos
        })
    });
});

app.post("/newtodo", (req, res) => {
    todo.build({
            task: req.body.task,
            complete: 'f'
        })
        .save().then(function (newTodo) {
            return res.redirect("/")
        })
});

app.post("/complete/:id", (req, res) => {
    todo.update({
        complete: 't'
    }, {
        where: {
            id: req.params.id
        }
    }).then(function () {
       return res.redirect("/");
    })
});

app.post("/deleteOne/:id", (req, res) => {
    todo.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(function () {
           return res.redirect("/");
        })
});

app.post("/deleteCompleted", (req, res) => {
    todo.destroy({
            where: {
                complete: 't'
            }
        })
        .then(function () {
        })
        .catch(function (err) {
            res.status(500).send(err);
        })
    return res.redirect("/");
});


app.post("/edit/:id", (req, res) => {
    todo.update({
        task: req.body.task
    }, {
        where: {
            id: req.params.id
        }
    }).then(function (newTodo) {
       return res.redirect("/");
    })
});


app.listen(8000, () => {
    console.log(`Server listening on port ${port}.`);
});

