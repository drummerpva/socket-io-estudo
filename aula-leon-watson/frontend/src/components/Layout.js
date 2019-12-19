import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { USER_CONNECTED, LOGOUT } from "../Events";
import LoginForm from "./LoginForm";
import ChatContainer from "./chats/ChatContainer";

const socketUrl = "http://localhost:3333";
export default function Layout({ title }) {
  const [socket, setSocket] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    initSocket();
  }, []);

  const initSocket = () => {
    const sio = io(socketUrl);
    sio.on("connect", () => {
      console.log("WS Conected!");
    });

    setSocket(sio);
  };

  const setConnectedUser = userConnected => {
    socket.emit(USER_CONNECTED, userConnected);
    setUser(userConnected);
  };

  const logout = () => {
    socket.emit(LOGOUT);
    setUser(null);
  };
  console.log(user);
  return (
    <div className="container">
      {socket && !user ? (
        <LoginForm socket={socket} setUser={setConnectedUser} />
      ) : (
        <ChatContainer socket={socket} user={user} logout={logout} />
      )}
    </div>
  );
}
