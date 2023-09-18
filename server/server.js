const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

let users = [];
let messages = {};
const adminId = "12345678907"; // Cambia esto al ID único que deseas para el admin
const adminSocketMap = {};

io.on("connection", (socket) => {
  console.log("Client Connected");

  socket.on("join server", ({ username, id }) => {
    const user = {
      username,
      id: id || socket.id,
    };
    users.push(user);

    if (id === "1234567890") {
      // Si el usuario es el admin, asigna el ID único y guarda el socket en el mapa
      user.id = adminId;
      adminSocketMap[adminId] = socket;
      console.log("quiero saber", adminSocketMap);
      if (messages[user.username]) {
        messages[user.username].forEach((message) => {
          socket.emit("new message", message);
        });
        delete messages[user.username]; // Borra los mensajes almacenados después de enviarlos
      }
    }

    io.emit("new user", users);
    io.emit("connection info", {
      id: user.id,
      username: user.username,
    });
    console.log(users);
  });

  socket.on("send message", ({ content, to, sender, chatName }) => {
    const payload = {
      content,
      to,
      chatName: sender,
      sender,
    };

    if (to === adminId && adminSocketMap[adminId]) {
      // Si el mensaje va al admin y el socket del admin existe, envía el mensaje al admin
      adminSocketMap[adminId].emit("new message", payload);
    } else {
      socket.to(to).emit("new message", payload);
    }

    if (!messages[chatName]) {
      messages[chatName] = [];
    }
    messages[chatName].push(payload);

    /*     socket.to(to).emit("new message", payload);
    if (!messages[chatName]) {
      messages[chatName] = []; // Initialize the message array for the chat if it doesn't exist
    }
    messages[chatName].push({
      sender,
      content,
    }); */
  });

  socket.on("disconnect", () => {
    users = users.filter((u) => u.id !== socket.id);

    if (socket.id === adminSocketMap[adminId]?.id) {
      // Si el socket que se desconectó es el socket del admin, elimina el mapa del admin
      delete adminSocketMap[adminId];
    }

    io.emit("new user", users);
  });
});

server.listen(1337, () => console.log("server is running on port 1337"));
