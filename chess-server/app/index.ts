import { WebSocketServer } from "ws";


const server = new WebSocketServer(
    {
        port: 5001
    },
    () => console.log("Server started.")
);

server.on("connection", socket => socket.on("message", console.log));
