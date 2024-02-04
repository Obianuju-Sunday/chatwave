require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const mongoData = process.env.DATABASE_URL;
mongoose.connect(mongoData);
const cors = require('cors')
const database = mongoose.connection;
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const routes = require('./routes/userRoute');


database.on('error', (error) => {
  console.log(error);
})

database.once('connected', () => {
  console.log('Database Connected');
})

app.use(express.json())

app.use(
  '/api', routes);

app.get('/', (req, res) => {

  const path = require('path');

  const filePath = path.join(__dirname, '..', 'client', 'home', 'index.html');

  res.sendFile(filePath);

})

io.on("connection", (socket) => {
  console.log('A user connected');
  socket.on("disconnect", () => {
    console.log('A user disconnected ');
  })
  socket.on("chat message", (msg) => {
    // console.log("message:", msg);
    io.emit("chat message", msg)
  })
});

server.listen(4000, () => {
  console.log('Listening on port 4000');
})

