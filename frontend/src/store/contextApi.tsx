import {  createContext, useContext, useState, type ReactNode } from "react";


interface Props{
    name:string,
    room:string,
    nameHandler:(val:string)=>void,
    roomHandler:(val:string)=>void
}
export const chatctx=createContext<Props | null>(null)

const ChatProvider=({children}:{children:ReactNode})=>{
    const [name,setName]=useState("");
    const[room,setRoom]=useState("");

    const roomHandler=(val:string)=>{
        setRoom(val)
    }
    const nameHandler = (val: string) => {
      setName(val);
    };
    return <chatctx.Provider value={{name,room,roomHandler,nameHandler}}>
        {children}
    </chatctx.Provider>
}

export const useChatCtx=()=>{
    const ctx=useContext(chatctx);
    if(!ctx) throw new Error("Context is null");

    return ctx
}



export default ChatProvider
