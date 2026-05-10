import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let count = 0;

let allSockets = new Map<string, WebSocket[]>();
wss.on("connection", (socket: WebSocket) => {
  count++;
  console.log("user connect ", count);

  socket.on("message", (message) => {
    const parsed = JSON.parse(message as unknown as string);
    console.log(parsed)
    if (parsed.type === "join room") {
      const roomId = parsed.payload.roomId;

      if (!allSockets.has(roomId)) {
        allSockets.set(roomId, [socket]);
      } else {
        allSockets.get(roomId)?.push(socket);
      }
      console.log("joined the room!!")
    } else if (parsed.type === "chat") {
      const roomId = parsed.payload.roomId;
      const arr: WebSocket[] = allSockets.get(roomId) || [];

      arr.map((socket) => {
        socket.send(JSON.stringify(parsed));
      });
    }
    
  });
  socket.on("close", () => {
    console.log("disconnecting");
  });
  socket.send("pong");
});
