const express = require("express")
const bodyParser = require("body-parser")
const app = express()

const server = require("http").createServer(app)

app.use(express.static("public"))
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.use(bodyParser.json())

server.listen(3000)

//express
const messages = []

app.get("/messages", (req, res) => {
  res.send(messages)
})

// app.post("/messages", (req, res) => {
//   const username_temp = req.body.username
//   const username = (typeof username_temp !== "undefined" && username_temp.trim()) || "名無しさん"
//   const text = req.body.text
//   const time = req.body.time

//   if (!text) {
//     res.send({
//       state: false
//     })
//     return
//   }

//   const message = {
//     username,
//     text,
//     time
//   }

//   messages.push(message)

//   res.send({
//     state: true
//   })
// })

const io = require("socket.io").listen(server)

io.on("connection", socket => {
  socket.on("messages", msg_info => {
    messages.push(msg_info)
    console.log(messages)
    io.emit("messages", messages)
  })
})