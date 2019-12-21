import React, { useState, useEffect } from 'react';
import SideBar from '../sidebar/SideBar';
import {
  MESSAGE_SENT,
  TYPING,
  COMMUNITY_CHAT,
  MESSAGE_RECIEVED,
  PRIVATE_MESSAGE,
  USER_CONNECTED,
  USER_DISCONNECTED,
  NEW_CHAT_USER,
} from '../../Events';

import ChatHeading from './ChatHeading';
import Messages from '../messages/Messages';
import MessageInput from '../messages/MessageInput';
import { values, difference, differenceBy } from 'lodash';

export default function ChatContainer(props) {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [users, setUsers] = useState([]);
  const { user, logout } = props;

  const initSocket = socket => {
    const { user } = props;
    socket.emit(COMMUNITY_CHAT, resetChat);
    socket.on(PRIVATE_MESSAGE, addChat);
    socket.on('connect', () => {
      socket.emit(COMMUNITY_CHAT, resetChat);
    });
    socket.on(USER_CONNECTED, lUsers => {
      setUsers(values(lUsers));
    });
    socket.on(USER_DISCONNECTED, lUsers => {
      const removedUsers = differenceBy(users, values(lUsers), 'id');
      removeUsersFromChat(removedUsers);
      setUsers(values(users));
    });
    socket.on(NEW_CHAT_USER, addUserToChat);
  };

  const sendOpenPrivateMessage = reciever => {
    const { socket, user } = props;
    socket.emit(PRIVATE_MESSAGE, { reciever, sender: user.name, activeChat });
  };

  const addUserToChat = ({ chatId, newUser }) => {
    const newChats = chats.map(chat => {
      if (chat.id === chatId) {
        return Object.assign({}, chat, { users: [...chat.users, newUser] });
      }
      return chat;
    });
    setChats(newChats);
  };

  const removeUsersFromChat = removedUsers => {
    const newChats = chats.map(chat => {
      let newUsers = difference(
        chat.users,
        removedUsers.map(u => u.name)
      );
      return Object.assign({}, chat, { users: newUsers });
    });
    setChats(newChats);
  };

  useEffect(() => {
    const { socket } = props;
    initSocket(socket);

    return () => {
      const { socket } = props;
      socket.off(PRIVATE_MESSAGE);
      socket.off(USER_CONNECTED);
      socket.off(USER_DISCONNECTED);
      socket.off(NEW_CHAT_USER);
    };
  }, []);

  useEffect(() => {
    chats &&
      chats.forEach(c => {
        const messageEvent = `$${MESSAGE_RECIEVED}-${c.id}`;
        const typingEvent = `$${TYPING}-${c.id}`;
        props.socket._callbacks[typingEvent] = [updateTypingInChat(c.id)];
        props.socket._callbacks[messageEvent] = [addMessageToChat(c.id)];
      });
  }, [chats]);

  const resetChat = chat => {
    return addChat(chat, true);
  };

  const addChat = (chat, reset = false) => {
    // const newChats = reset ? [chat] : [...chats, chat];
    setChats(prevChats => (reset ? [chat] : [...prevChats, chat]));
    setActiveChat(reset ? chat : activeChat);

    /* const messageEvent = `${MESSAGE_RECIEVED}-${chat.id}`;
    const typingEvent = `${TYPING}-${chat.id}`;

    socket.on(typingEvent, updateTypingInChat);
    socket.on(messageEvent, addMessageToChat(chat.id)); */
  };

  const addMessageToChat = chatId => {
    return message => {
      let newChats = chats.map(chat => {
        if (chat.id === chatId) chat.messages.push(message);
        return chat;
      });
      setChats(newChats);
    };
  };

  const updateTypingInChat = chatId => {
    return ({ isTyping, user }) => {
      if (user !== props.user.name) {
        let newChats = chats.map(chat => {
          if (chat.id === chatId) {
            if (isTyping && !chat.typingUsers.includes(user))
              chat.typingUsers.push(user);
            else if (!isTyping && chat.typingUsers.includes(user))
              chat.typingUsers = chat.typingUsers.filter(u => u !== user);
          }
          return chat;
        });
        setChats(newChats);
      }
    };
  };

  const sendMessage = (chatId, message) => {
    const { socket } = props;
    socket.emit(MESSAGE_SENT, { chatId, message });
  };
  const sendTyping = (chatId, isTyping) => {
    const { socket } = props;
    socket.emit(TYPING, { chatId, isTyping });
  };
  return (
    <div className="container">
      <SideBar
        logout={logout}
        chats={chats}
        user={user}
        users={users}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        onSendPrivateMessage={sendOpenPrivateMessage}
      />
      <div className="chat-room-container">
        {activeChat !== null ? (
          <div className="chat-room">
            <ChatHeading name={activeChat.name} />
            <Messages
              messages={activeChat.messages}
              user={user}
              typingUsers={activeChat.typingUsers}
            />
            <MessageInput
              sendMessage={message => {
                sendMessage(activeChat.id, message);
              }}
              sendTyping={isTyping => {
                sendTyping(activeChat.id, isTyping);
              }}
            />
          </div>
        ) : (
          <div className="chat-room choose">
            <h3>Choose a Chat</h3>
          </div>
        )}
      </div>
    </div>
  );
}
