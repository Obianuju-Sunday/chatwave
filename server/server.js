const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get('/', (req, res) => {

  const path = require('path');

  const filePath = path.join(__dirname, '..', 'src', 'pages', 'home', 'index.html');

  res.sendFile(filePath);

})

io.on("connection", (socket) => {
  console.log('A user connected');
  socket.on("disconnect", () => {
    console.log('A user disconnected ');
  })
});

server.listen(4000, () => {
  console.log('Listening on port 4000');
})

