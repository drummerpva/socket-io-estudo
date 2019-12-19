import React, { useState } from "react";
import SideBar from "./SideBar";

export default function ChatContainer(props) {
  const [chats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const { user, logout } = props;

  const sendMessage = () => {};
  const sendTyping = () => {};

  return (
    <div className="container">
      <SideBar
        logout={logout}
        chats={chats}
        user={user}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />
      <div className="chat-room-container">
        {activeChat !== null ? (
          <div className="chat-room">
            <ChatHeading name={activeChat.name} />
            <Messages
              messages={activeChat.messages}
              user={user}
              typingUser={activeChat.typingUsers}
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
        ) : null}
      </div>
    </div>
  );
}
