import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import uuid from "uuid/v4";

const myId = uuid();
const socket = io("http://localhost:8080");
socket.on("connect", () =>
  console.log("[IO] Connect => A new connection has been established")
);

export default () => {
  const [message, updateMessage] = useState("");
  const [messages, updateMessages] = useState([]);

  useEffect(() => {
    const handleNewMessage = newMessage =>
      updateMessages([...messages, newMessage]);
    socket.on("chat.message", handleNewMessage);

    return () => socket.off("chat.message", handleNewMessage);
  }, [messages]);

  const handleInputChange = e => {
    updateMessage(e.target.value);
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chat.message", {
        id: myId,
        message
      });
      updateMessage("");
    }
  };

  return (
    <main className="container">
      <ul className="list">
        {messages.map((m, i) => (
          <li
            className={`list__item list__item--${
              m.id === myId ? "mine" : "other"
            } `}
            key={i}
          >
            <span
              className={`message message--${
                m.id === myId ? "mine" : "other"
              } `}
            >
              {m.message}
            </span>
          </li>
        ))}
      </ul>
      <form className="form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="form__field"
          placeholder="Digite uma nova mensagem"
          value={message}
          onChange={handleInputChange}
        />
      </form>
    </main>
  );
};
