const express = require("express")

const app = express()

app.use(express.json())

app.get("/", (req, res) => {
  return res.json({
    message: "Hello World ignite"
  })
})

app.get("/courses", (req, res) => {
  const query = req.query
  console.log(query)
  return res.json(["curso 1", "curso 2", "curso 3"])
})

app.post("/courses", (req, res) => {
  const body = req.body
  console.log(body)
  return res.json(["curso 1", "curso 2", "curso 3", "curso 4"])
})

app.put("/courses/:id", (req, res) => {
  const params = req.params
  const { id } = params
  console.log(id)
  return res.json(["curso 6", "curso 2", "curso 3", "curso 4"])
})

app.patch("/courses/:id", (req, res) => {
  return res.json(["curso 6", "curso 7", "curso 3", "curso 4"])
})

app.delete("/courses/:id", (req, res) => {
  return res.json(["curso 6", "curso 3", "curso 4"])
})

app.listen(3333)
