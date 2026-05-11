import { motion } from "motion/react";
import {  useRef } from "react";
import { useNavigate } from "react-router";

function HomePage({socket}:{socket:WebSocket | null}) {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const roomRef = useRef<HTMLInputElement | null>(null);
  const navigate=useNavigate()
  const handler = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (nameRef.current && roomRef.current) {
      
      let obj = {
        type: "join",
        payload: {
          username: nameRef.current.value,
          roomId: roomRef.current.value,
        },
      };
      const message = JSON.stringify(obj);
      if (socket) {
        socket.send(message);
      }
      navigate(`/username/${nameRef.current.value}/room/${roomRef.current.value}`);
      nameRef.current.value = "";
      roomRef.current.value = "";
    }
  };
  return (
    <div className="h-screen bg-black flex items-center justify-center">
      <motion.form
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="w-120 flex flex-col  border border-white shadow shadow-pink-300   gap-4 h-80 bg-gray-500 p-4 items-center justify-center rounded-lg"
        onSubmit={handler}
      >
        <input
          ref={nameRef}
          className="w-full py-3 px-1 bg-gray-700 text-white/80 outline-none focus:border focus:border-gray-600 flex rounded-lg"
          placeholder="Username"
        />
        <input
          ref={roomRef}
          className="w-full py-3 px-1 bg-gray-700 text-white/80 outline-none focus:border focus:border-gray-600 flex rounded-lg"
          placeholder="Enter RoomName..."
        />
        <button className="w-full py-3 px-1 rounded-lg cursor-pointer capitalize bg-red-600/70 active:scale-95 transition-all">
          create room
        </button>
      </motion.form>
    </div>
  );
}
export default HomePage;
