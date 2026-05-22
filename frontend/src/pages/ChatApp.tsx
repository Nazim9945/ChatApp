import { motion } from "motion/react";

import { useEffect, useRef } from "react";
import { BsSend } from "react-icons/bs";

import type { User } from "../App";
import { useChatCtx } from "../store/contextApi";
interface Props{
    socket:WebSocket | null,
    message:User[],
    setMessage:(val:User)=>void
}

export const ChatApp=({socket,message,setMessage}:Props)=>{
  const bottomRef=useRef<HTMLDivElement | null>(null)

const{name,room}=useChatCtx()
const inputRef=useRef<HTMLInputElement|null>(null)
const handler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault();
  if (!inputRef.current?.value) return;
    if (inputRef.current) {
      let obj = {
        type: "chat",
        payload: {
          username: name,
          roomId: room,
          message: inputRef.current.value,
        },
      };
      const message = JSON.stringify(obj);
      socket?.send(message);
      // setMessage(prev=>[...prev,inputRef.current?.value || "")--->Type of this?
      // @ts-ignore
      // setMessage(inputRef.current.value)
      setMessage(obj.payload);

      inputRef.current.value = "";
    }
};
useEffect(()=>{
 bottomRef.current?.scrollIntoView({ behavior: "smooth" });
},[message])
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="absolute right-5 top-10 h-14 w-14 rounded-full border-2 border-white/90 p-8 flex items-center justify-center bg-gray-500">
          <span className="font-bold text-2xl  text-yellow-100">
            {name?.substring(0, 2).toUpperCase() || "UK"}
          </span>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="w-180 mx-auto flex flex-col  border border-white shadow shadow-pink-300   gap-4 h-100 bg-gray-500 p-4  justify-center rounded-lg"
        >
          <div className="h-[80%] flex flex-col  gap-2 overflow-x-scroll  no-scrollbar py-2 relative">
            {message.map((mes, index) => {
              return (
                <div
                  key={index}
                  className={` max-w-[40%] min-w-[5%]  wrap-break-word rounded-md shadow drop-shadow-black py-2 px-1 ${mes.username === name ? "self-end bg-blue-700 text-white" : "self-start bg-yellow-300 "}`}
                >
                  {mes.message}
                </div>
              );
            })}
            <div ref={bottomRef}></div>
          </div>
          <div className="w-full flex justify-between items-center gap-2 p-2 mb-1 mt-2">
            <input
              className=" w-full py-3 px-1 bg-gray-700 text-white/80 outline-none focus:border focus:border-gray-600 flex rounded-lg"
              type="text"
              placeholder="Enter messages..."
              ref={inputRef}
              required
              onKeyDown={(e) => {
                
                if(e.key==='Enter'){
                  e.preventDefault()
                  if (!inputRef.current?.value) return;
                  if (inputRef.current) {
                    let obj = {
                      type: "chat",
                      payload: {
                        username: name,
                        roomId: room,
                        message: inputRef.current.value,
                      },
                    };
                    const message = JSON.stringify(obj);
                    socket?.send(message);
                  //  @ts-ignore
                    setMessage(obj.payload);

                    inputRef.current.value = "";
                  }
                }
              }}
            />
            <button
              className="border border-blue-700  p-3 text-xl rounded-md bg-blue-700 text-white"
              onClick={handler}
            >
              <BsSend />
            </button>
          </div>
        </motion.div>
      </div>
    );
}