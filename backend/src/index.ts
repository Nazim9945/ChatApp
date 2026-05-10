import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
let count = 0;
interface User{
    socket:WebSocket,
    username:string
}
let allSockets = new Map<string, User[]>();
wss.on("connection", (socket: WebSocket) => {
  count++;
  console.log("user connect ", count);

  socket.on("message", (message) => {
    const parsed = JSON.parse(message as unknown as string);
    console.log(parsed)
    if (parsed.type === "join") {
      const roomId = parsed.payload.roomId;
      const username=parsed.payload.username

      if (!allSockets.has(roomId)) {
        allSockets.set(roomId, [{socket, username}]);
      } else {
        allSockets.get(roomId)?.push({socket,username});
      }
      console.log("joined the room!!")
    } 
    if (parsed.type === "chat") {
      const roomId = parsed.payload.roomId;
      const arr: User[] = allSockets.get(roomId) || [];

      arr.map((data) => {
        data.socket.send(JSON.stringify(parsed));
      });
    }

    if(parsed.type==="leave"){
         const roomId = parsed.payload.roomId;
         let arr:User[]=allSockets.get(roomId) || [];
         if(arr.length==0) {
            allSockets.delete(roomId)
         }
         else{
            arr=arr.filter((soc)=>soc.socket!=socket)
            allSockets.set(roomId,arr);
         }
    }
    
  });
  socket.on("close", () => {
    console.log("disconnecting");
  });
  
});
