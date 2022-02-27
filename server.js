const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./util/message");
const { userjoin, getcurrentuser, getroomuser } = require("./util/user");

const app = express();
const server = http.createServer(app);
const io = socketio().listen(server);

app.use(express.static(path.join(__dirname, "public"))); // for using of static files
const botname = "chatcord";

io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    // whenever the client connect it will console new connection
    const user = userjoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit("message", formatMessage(botname, "welcome to chat")); // this is only for one user that got connected

    //broadcast when user connect
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botname, `${user.username} has joined the chat`)
      ); //it will notify all users about connecion except the user that connected
    // io.emit() for all the user no exception

    // send user and room info
    io.to(user.room).emit("roomuser", {
      room: user.room,
      users: getroomuser(user.room),
    });
  });

  // Runs when user disconnects
  socket.on("disconnect", () => {
    const user = userleave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botname, `${user.username} has left the chat`)
      );
      io.to(user.room).emit("roomuser", {
        room: user.room,
        users: getroomuser(user.room),
      });
    }
  });

  // listening for chat message
  socket.on("chatMessage", (msg) => {
    const user = getcurrentuser(socket.id);
    io.to(user.room).emit("message", formatMessage(USER, msg));
  });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
