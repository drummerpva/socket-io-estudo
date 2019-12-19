const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const SocketManager = require("./SocketManager");

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", (req, res) => {
  res.send("All ok");
});

io.on("connection", socket => {
  SocketManager(io, socket);
});

server.listen(3333, () => {
  console.log("Running...");
});
