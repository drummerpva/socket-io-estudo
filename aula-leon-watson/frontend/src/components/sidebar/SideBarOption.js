import React from 'react';

export default props => {
  const { lastMessage, active, onClick, name } = props;

  return (
    <div className={`user ${active ? 'active' : ''} `} onClick={onClick}>
      <div className="user-photo">{name[0].toUpperCase()}</div>
      <div className="user-info">
        <div className="name">{name}</div>
        {lastMessage && <div className="last-message">{lastMessage}</div>}
      </div>
    </div>
  );
};
