import React, { useState } from 'react';
import { VERIFY_USER } from '../Events';

export default function LoginForm(props) {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState();
  const { socket } = props;

  const setUser = ({ user, isUser }) => {
    if (isUser) {
      setError('User name taken');
    } else {
      setError('');
      props.setUser(user);
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    socket.emit(VERIFY_USER, nickname, setUser);
  };

  const handleChange = e => {
    setNickname(e.target.value);
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="nickname">
          <h2>Got a nickname?</h2>
        </label>
        <input
          type="text"
          id="nickname"
          value={nickname}
          onChange={handleChange}
          placeholder="MyCoolUsername"
        />
        <div className="error">{error ?? null}</div>
      </form>
    </div>
  );
}
