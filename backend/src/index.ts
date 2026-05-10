import {WebSocket,WebSocketServer} from 'ws'

const wss=new WebSocketServer({port:8080})
let count=0;

wss.on("connection",(socket:WebSocket)=>{
    count++;
    console.log("user connect ",count)


    socket.on('message',(message)=>{
        
        if(message.toString()==="bye"){
            socket.send("disconnecting u now....")
            socket.close()
        }
        else{
            socket.send("pong pong")
        }
       
    })
    socket.send("pong")

    socket.on('close',()=>{
        console.log("disconnecting")
    })
  
   
})

