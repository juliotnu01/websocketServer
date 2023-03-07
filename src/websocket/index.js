import express from "express";
import ws from "websocket";
import srv from "http";

const app = express();
const webSocketServer = ws.server;
const server = srv.Server(app);

app.set("puerto", 3000);
const PORT = app.get("puerto");

server.listen(PORT, () => {
  console.log(`servidor iniciado en el puerto: ${PORT}`);
});

export const wsServer = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});
