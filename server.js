const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const Busboy = require("busboy");
const path = require("path");
const fs = require("fs");
const models = require("./models");

const port = process.env.PORT || 8000;
const app = express();

let user;

app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(express.static(path.join(__dirname, "./public")));
app.use(bodyParser.urlencoded({
    extended: true

}));

//SEQUELIZE
const todo = models.todos.build(
     {task:'Homework', complete: true}
);

todo.save().then( function(newTodo) {
    console.log('task is: ',newTodo.task, ' complete = ', newTodo.complete);
});


//TODO LIST

let todos = [];

app.get("/", function (req, res) {
    res.render('index', {
        todos: todos
    });
});

app.post("/newtodo", (req, res) => {
    let newTodo = req.body;
    newTodo.complete = false;
    todos.push(newTodo);
    res.redirect("/");
});

app.post("/complete/:todo", (req, res) => {
    let task = req.params.todo;
    let foundTodo = todos.find(function (todo) {
        return todo.task === task;
    });
    foundTodo.complete = !foundTodo.complete;
    res.redirect("/")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

