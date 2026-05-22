import { Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import { ChatApp } from "./pages/ChatApp";
import { useEffect,  useState } from "react";
import { useChatCtx } from "./store/contextApi";
import popup from './assets/popup.mp3'

const audioPopup=new Audio(popup)
audioPopup.volume=1
export interface User{
  username:string,
  roomId:string,
  message:string
}

function App(){
  const{totalUserHandler}=useChatCtx()
  const[message,setMessage]=useState<User[]>([])
  const [socket,setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket("http://localhost:8080");
    setSocket(ws)
    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data) 
      if(parsed.type=='join' || parsed.type=='leave'){
          totalUserHandler(parsed.noOfUserInRoom)
      }
     else{
      audioPopup.pause()
       const message=parsed.payload
      console.log(parsed);
      setMessage(prev=>[...prev,message])
      audioPopup.play()
     }
      // token
    };
    return ()=>{
      ws.close()
    }

  }, []);
  // useEffect(()=>{
  //     if(socket){
  //       socket.onmessage = (event) => {
  //         const parsed = JSON.parse(event.data);
  //         const message = parsed.payload.message;
  //         console.log(parsed);
  //         setMessage((prev) => [...prev, message]);
  //         // token
  //       };
  //     }
  // },[message])
const handler=(message:User)=>{
  
    setMessage(prev=>[...prev,message])
    audioPopup.play();
}
  return (
    <Routes>
      <Route path="/" element={<HomePage socket={socket}/>} />
      <Route path="/chat" element={<ChatApp message={message} setMessage={handler}  socket={socket}/>} />
    </Routes>
  );
}
export default App