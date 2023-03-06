const express = require("express");
const cors = require("cors");
const app = express();
const server = require("http").Server(app);
const webSocketServer = require("websocket").server;

app.set("puerto", 3000);
app.use(cors());
app.use(express.json());

const wsServer = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

const PORT = app.get("puerto");

wsServer.on("request", (request) => {
  const connection = request.accept(null, request.origin);

  connection.on("message", (message) => {
    wsServer.broadcast(message.utf8Data);
  });
  connection.on("close", (message) => {
    console.log("El cliente se desconecto");
  });
});

server.listen(PORT, () => {
  console.log(`servidor iniciado en el puerto: ${PORT}`);
});
