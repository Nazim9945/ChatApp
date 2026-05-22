import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let count = 0;
interface User{
    socket:WebSocket,
    username:string
}
let allSockets = new Map<string, User[]>();
wss.on("connection", (socket: WebSocket, req: any) => {
  // console.log(req)
  count++;
  console.log("user connect ", count);

  socket.on("message", (message) => {
    const parsed = JSON.parse(message as unknown as string);
    console.log(parsed);
    if (parsed.type === "join") {
      const roomId = parsed.payload.roomId;
      const username = parsed.payload.username;
      
      if (!allSockets.has(roomId)) {
        allSockets.set(roomId, [{ socket, username }]);
      } else {
        allSockets.get(roomId)?.push({ socket, username });
      }
      console.log("joined the room!!");
      const sockets=allSockets.get(roomId)
      sockets?.forEach(soc=>{
        soc.socket.send(
          JSON.stringify({
            type: "join",
            noOfUserInRoom: sockets?.length,
          }),
        );
      })
      // socket.send(
      //   JSON.stringify({
      //     type: "join",
      //     noOfUserInRoom: allSockets.get(roomId)?.length,
      //   }),
      // );
    }
    if (parsed.type === "chat") {
      const roomId = parsed.payload.roomId;
      const arr: User[] = allSockets.get(roomId) || [];

      // const newObj = {
      //   username: parsed.username,
      //   message: parsed.message,
      //   roomId,
      //   roomLen: arr.length,
      // };
      arr.map((data) => {
        if (data.socket != socket) {
          data.socket.send(JSON.stringify(parsed));
        }
      });
    }

  
    socket.on("close", () => {
       const roomId = parsed.payload.roomId;
       let arr: User[] = allSockets.get(roomId) || [];
       if (arr.length == 0) {
         allSockets.delete(roomId);
       } else {
         arr = arr.filter((soc) => soc.socket != socket);
         allSockets.set(roomId, arr);
       }
       const sockets = allSockets.get(roomId);
       sockets?.forEach((soc) => {
         soc.socket.send(
           JSON.stringify({
             type: "leave",
             noOfUserInRoom: sockets?.length,
           }),
         );
       });
     
      console.log("disconnecting");
    });
  });
  
});
