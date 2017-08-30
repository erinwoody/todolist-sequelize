//IMPORTS
const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const Busboy = require("busboy");
const path = require("path");
const fs = require("fs");
const models = require("./models");
const port = process.env.PORT || 8000;
const app = express();
const todo = models.todo;

//MIDDLEWARE
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(express.static(path.join(__dirname, "./public")));
app.use(bodyParser.urlencoded({
    extended: true

}));

//ROUTES
app.get("/", (req, res) => {
    todo.findAll().then(function (todos) {
        res.render("index", todos)
    });
});

app.get("/todo/:id", (req, res) => {
  models.todo
    .findById(req.params.id)
    .then(function(foundTodo) {
      res.send(foundTodo);
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});

app.post("/newTodo", (req, res) => {
    todo.build({
        task: req.body.task,
        complete: 'f'
    }).save().then(function (newTodo) {
    
    });
    return res.redirect("/");
});

app.post("/complete/:todo", (req, res) => {
    let task = req.params.todo;
    let foundTodo = todos.find(function (todo) {
        return todo.task === task;
    });
    foundTodo.complete = !foundTodo.complete;
    res.redirect("/")
});


app.delete("/todo/:id", (req, res) => {
  models.todo
    .destroy({ where: { id: req.params.id } })
    .then(function() {
      res.send("Deleted todo");
    })
    .catch(function(err) {
      res.status(500).send(err);
    });
});


app.listen(8000, () => {
  console.log(`Server listening on port ${port}.`);
});


