import { motion } from "motion/react";
import {   useState } from "react";
import { FaCopy } from "react-icons/fa";
import { IoCheckmark, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router";
import GenerateId from "../helper/GenerateId";
import {  useChatCtx } from "../store/contextApi";

function HomePage({socket}:{socket:WebSocket | null}) {
const {name,nameHandler,room,roomHandler}=useChatCtx()
  const [open,setOpen]=useState(false);
  // const nameRef = useRef<HTMLInputElement | null>(null);
  // const roomRef = useRef<HTMLInputElement | null>(null);
  const [copy,setCopy]=useState(false)
  const[roomId,setRoomId]=useState("")
  // const[random,setRandomCode]=useState("")
  const navigate=useNavigate()
  const handler = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    if(!name || !room) return;
    
    
      
      let obj = {
        type: "join",
        payload: {
          username: name,
          roomId: room
        },
      };
      const message = JSON.stringify(obj);
      if (socket) {
        socket.send(message);
      }
      navigate(`/chat`);
      
    
  };
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      {open && (
        <motion.div
          initial={{ y: -200 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute w-60 h-40 right-10 top-10 bg-yellow-300/60 rounded-md shadow shadow-blue-400 flex  items-center justify-center p-4 "
        >
          <div className="bg-gray-400 text-2xl flex justify-between w-full p-3 rounded-md items-center">
            <div
              className="absolute right-2 top-2 h-6 w-6 flex items-center justify-center rounded-full p-1 bg-white/60 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <IoClose />
            </div>
            <div className="select-none">{roomId}</div>
            <div
              onClick={async () => {
                await navigator.clipboard.writeText(roomId);
                setCopy(true);
                setTimeout(() => setCopy(false), 3000);
              }}
              className="bg-blue-700/40 rounded-md p-2 text-white cursor-pointer"
            >
              {copy ? <IoCheckmark /> : <FaCopy />}
            </div>
          </div>
          {/* <div className="tex">Share this code with your friends</div> */}
        </motion.div>
      )}
      <motion.form
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="w-120 flex flex-col  border border-white shadow shadow-pink-300   gap-4 h-80 bg-gray-500 p-4 items-center justify-center rounded-lg"
        onSubmit={handler}
      >
        <input
          // ref={nameRef}
          value={name}
          className="w-full py-3 px-1 bg-gray-700 text-white/80 outline-none focus:border focus:border-gray-600 flex rounded-lg"
          placeholder="Username"
          required
          minLength={3}
          maxLength={20}
          onChange={(e) => nameHandler(e.target.value)}
        />
        <input
          // ref={roomRef}
          value={room}
          className="w-full py-3 px-1 bg-gray-700 text-white/80 outline-none focus:border focus:border-gray-600 flex rounded-lg"
          placeholder="Enter Room ID"
          required
          minLength={6}
          maxLength={6}
          onChange={(e) => roomHandler(e.target.value)}
        />
        <button className="w-full py-3 px-1 rounded-lg cursor-pointer capitalize bg-red-600/70 active:scale-95 transition-all">
          Join room
        </button>
        <div
          onClick={() => {
            setOpen(true);
            setRoomId(GenerateId());
          }}
          className="w-full py-3 px-1 rounded-lg cursor-pointer capitalize bg-white/40 active:scale-95 transition-all text-center"
        >
          Generate Room ID
        </div>
      </motion.form>
    </div>
  );
}
export default HomePage;
