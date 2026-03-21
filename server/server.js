require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const Message = require("./models/Message");

// ✅ MongoDB connection (FIXED)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));

const app = express();
app.use(cors());
app.use(express.json());

// ✅ ROOT ROUTE (IMPORTANT)
app.get("/", (req, res) => {
  res.send("Chat App Backend Running 🚀");
});

// ✅ GET MESSAGES
app.get("/messages/:room", async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room });
    res.json(messages || []);
  } catch (err) {
    res.json([]);
  }
});

const server = http.createServer(app);

// ✅ SOCKET FIX (ALLOW ALL ORIGIN)
const io = new Server(server, {
  cors: { origin: "*" },
});

// 🟢 USERS TRACK
let users = [];

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join_room", ({ username, room }) => {
    socket.join(room);

    users.push({ id: socket.id, username, room });

    const roomUsers = users.filter((u) => u.room === room);
    io.to(room).emit("room_users", roomUsers);
  });

  socket.on("send_message", async (data) => {
    try {
      data.status = "delivered";

      const newMsg = new Message(data);
      await newMsg.save();

      io.to(data.room).emit("receive_message", data);
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("message_seen", ({ room }) => {
    socket.to(room).emit("update_seen");
  });

  socket.on("typing", ({ username, room }) => {
    socket.to(room).emit("show_typing", username);
  });

  socket.on("stop_typing", (room) => {
    socket.to(room).emit("hide_typing");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    users = users.filter((u) => u.id !== socket.id);
    io.emit("room_users", users);
  });
});

// ✅ PORT FIX (VERY IMPORTANT)
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});