import {WebSocket,WebSocketServer} from 'ws'

const wss=new WebSocketServer({port:8080})
let count=0;

wss.on("message",(socket:WebSocket)=>{
    count++;
    console.log("user connect ",count)


    socket.on('message',(messgae)=>{
        socket.send(messgae.toString())

    })
    socket.on('disconnet',()=>{
        console.log("user disconnect")
        socket.send("disconnected");
    })
})