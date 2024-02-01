const express = require("express");
const http = require("http");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { generateRandomString } = require("./functions/randomstring");
// const { Server } = require("socket.io");
const Room = require("./rooms/rooms");
const room = new Room();

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
// require("./routes/room.socket")(server);

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

io.on("connection", async (socket) => {
  const roomID = await room.joinRoom();
  // join room
  socket.join(roomID);
  console.log("roomjoined", roomID);
  let randomString = generateRandomString;
  // socket.emit("random-string", randomString);
  socket.on("join-room", (username) => {
    console.log(username, "joined");
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", username);
    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", username);
    });
  });
  socket.on("start-round", (randomString) => {
    socket.to(roomID).emit("start-round", randomString);
    io.to(roomID).emit("set-word", randomString);
  });
  socket.on("set-score", (score, username) => {
    socket.to(roomID).emit("set-score", score, username);
  });
  socket.on("send-message", (message, username) => {
    socket.to(roomID).emit("receive-message", message, username);
  });

  socket.on("start-timer", () => {
    socket.to(roomID).emit("start-timer");
  });

  socket.on("disconnect", () => {
    // leave room
    room.leaveRoom(roomID);
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
