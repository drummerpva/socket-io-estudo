import React, { useEffect } from 'react';

export default props => {
  const { messages, user, typingUsers } = props;
  const ref = React.createRef();

  useEffect(() => {
    ref.current.scrollHeight && scrollDown();
  });

  const scrollDown = () => {
    ref.current.scrollTop = ref.current.scrollHeight;
  };
  return (
    <div ref={ref} className="thread-container">
      <div className="thread">
        {messages &&
          messages.map((mes, i) => {
            return (
              <div
                key={mes.id}
                className={`message-container ${mes.sender === user.name &&
                  'right'}`}
              >
                <div className="time">{mes.time}</div>
                <div className="data">
                  <div className="message">{mes.message}</div>
                  <div className="name">{mes.sender}</div>
                </div>
              </div>
            );
          })}
        {typingUsers &&
          typingUsers.map(name => {
            return (
              <div key={name} className="typing-user">
                {`${name} is typing . . .`}
              </div>
            );
          })}
      </div>
    </div>
  );
};
