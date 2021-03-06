const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function searchUserByUsername(username) {
  const user = users.find((user) => user.username === username);
  return user;
}

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = searchUserByUsername(username);

  if (!user)
    return response.status(404).json({
      error: "User Not Found",
    });

  request.user = user;

  return next();
}

app.get("/users", (request, response) => {
  return response.status(200).json(users);
});

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  if (searchUserByUsername(username))
    return response.status(400).json({
      error: "Username Already Being Used",
    });

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo)
    return response.status(404).json({
      error: "Todo Not Found",
    });

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find((todo) => todo.id === id);

  if (!todo)
    return response.status(404).json({
      error: "Todo Not Found",
    });

  todo.done = true;

  return response.status(201).json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1)
    return response.status(404).json({
      error: "Todo Not Found",
    });

  user.todos.splice(todoIndex, 1);

  return response.status(204).json();
});

module.exports = app;
