import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT, VERIFY_USER } from '../Events';
import LoginForm from './LoginForm';
import ChatContainer from './chats/ChatContainer';

const socketUrl = 'http://localhost:3333';
export default function Layout({ title }) {
  const [socket, setSocket] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    initSocket();
  }, []);

  const initSocket = () => {
    const sio = io(socketUrl);
    sio.on('connect', () => {
      if (user) {
        reconnect(sio);
      } else {
        console.log('WS Conected!');
      }
    });
    setSocket(sio);
  };

  const reconnect = socket => {
    socket.emit(VERIFY_USER, user.name, ({ isUser, user }) => {
      if (isUser) {
        setUser(null);
      } else {
        setUser(user);
      }
    });
  };

  const setConnectedUser = userConnected => {
    socket.emit(USER_CONNECTED, userConnected);
    setUser(userConnected);
  };

  const logout = () => {
    socket.emit(LOGOUT);
    setUser(null);
  };
  return (
    <div className="container">
      {socket && !user ? (
        <LoginForm socket={socket} setUser={setConnectedUser} />
      ) : (
        socket && <ChatContainer socket={socket} user={user} logout={logout} />
      )}
    </div>
  );
}
