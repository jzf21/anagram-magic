var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(
  http,
  {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5000"],
      methods: ["GET", "POST", "PUT"],

      credentials: true,
    },
  },
  {
    allowEIO3: true, // false by default
  }
);

io.on("connection", (socket) => {
  console.log("User Online");

  socket.on("canvas-data", (data) => {
    socket.broadcast.emit("canvas-data", data);
  });
  socket.on("chat", (payload) => {
    io.emit("chat", payload);
  });
});

var server_port = 5000;
http.listen(server_port, () => {
  console.log("Started on : " + server_port);
});
