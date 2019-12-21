import React, { useState, useEffect } from 'react';

export default props => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  let typingInterval;
  let lastUpdateTime;

  useEffect(() => {
    return () => stopCheckingTyping();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    sendMessage();
    setMessage('');
  };
  const sendMessage = () => {
    props.sendMessage(message);
  };

  const sendTyping = () => {
    lastUpdateTime = Date.now();
    if (!isTyping) {
      setIsTyping(true);
      props.sendTyping(true);
      startCheckingTyping();
    }
  };

  const startCheckingTyping = () => {
    typingInterval = setInterval(() => {
      if (Date.now() - lastUpdateTime > 300) {
        setIsTyping(false);
        stopCheckingTyping();
      }
    }, 300);
  };

  const stopCheckingTyping = () => {
    if (typingInterval) {
      clearInterval(typingInterval);
      props.sendTyping(false);
    }
  };

  return (
    <div className="message-input">
      <form onSubmit={handleSubmit} className="message-form">
        <input
          id="message"
          type="text"
          className="form-control"
          value={message}
          autoComplete="off"
          placeholder="Type your message . . . "
          onKeyUp={e => {
            e.keyCode !== 13 && sendTyping();
          }}
          onChange={({ target }) => {
            setMessage(target.value);
          }}
        />
        <button disabled={message.length < 1} type="submit" className="send">
          Send
        </button>
      </form>
    </div>
  );
};
