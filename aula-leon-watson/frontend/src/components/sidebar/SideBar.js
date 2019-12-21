import React, { useRef, useState } from 'react';
import { FaList as FAMenu, FaSearch as FASearch } from 'react-icons/fa';
import { MdEject } from 'react-icons/md';
import { FiChevronDown as FAChevronDown } from 'react-icons/fi';

import SideBarOption from './SideBarOption';
import { get, last, differenceBy } from 'lodash';
import { createChatNameFromUsers } from '../../Factories';

export default function SideBar(props) {
  const [reciever, setReciever] = useState('');
  const [type] = useState({ CHATS: 'chats', USERS: 'users' });
  const [activeSideBar, setActiveSideBar] = useState(type.CHATS);
  const userRef = useRef();
  const { chats, activeChat, user, setActiveChat, logout, users } = props;

  const handleSubmit = e => {
    e.preventDefault();
    const { onSendPrivateMessage } = props;
    onSendPrivateMessage(reciever);
    setReciever('');
  };

  const addChatForUser = userName => {
    props.onSendPrivateMessage(userName);
    setActiveSideBar(type.CHATS);
  };

  return (
    <div id="side-bar">
      <div className="heading">
        <div className="app-name">
          Our Cool Chat <FAChevronDown />
        </div>
        <div className="menu">
          <FAMenu />
        </div>
      </div>
      <form className="search" onSubmit={handleSubmit}>
        <i className="search-icon">
          <FASearch />
        </i>
        <input
          placeholder="Search"
          type="text"
          value={reciever}
          onChange={({ target }) => setReciever(target.value)}
        />
        <div className="plus"></div>
      </form>
      <div className="side-bar-select">
        <div
          onClick={() => {
            setActiveSideBar(type.CHATS);
          }}
          className={`side-bar-select__option ${
            activeSideBar === type.CHATS ? 'active' : ''
          }`}
        >
          <span>Chats</span>
        </div>
        <div
          onClick={() => {
            setActiveSideBar(type.USERS);
          }}
          className={`side-bar-select__option ${
            activeSideBar === type.USERS ? 'active' : ''
          }`}
        >
          <span>Users</span>
        </div>
      </div>
      <div
        className="users"
        ref={userRef}
        onClick={e => {
          e.target === userRef && setActiveChat(null);
        }}
      >
        {activeSideBar === type.CHATS
          ? chats.map(chat => {
              if (chat.name) {
                const lastMessage = chat.messages[chat.messages.length - 1];
                const chatSideName =
                  chat.users.find(name => {
                    return name !== user.name;
                  }) || 'Community';
                const classNames =
                  activeChat && activeChat.id === chat.id ? 'active' : '';

                return (
                  <SideBarOption
                    key={chat.id}
                    name={
                      chat.isCommunity
                        ? chat.name
                        : createChatNameFromUsers(chat.users, user.name)
                    }
                    lastMessage={get(last(chat.messages), 'message', '')}
                    active={activeChat?.id === chat.id}
                    onClick={() => setActiveChat(chat)}
                  />
                );
              }

              return null;
            })
          : differenceBy(users, [user], 'id').map(otherUser => {
              return (
                <SideBarOption
                  key={otherUser.id}
                  name={otherUser.name}
                  onClick={() => {
                    addChatForUser(otherUser.name);
                  }}
                />
              );
            })}
      </div>
      <div className="current-user">
        <span>{user && user.name}</span>
        <div
          onClick={() => {
            logout();
          }}
          title="Logout"
          className="logout"
        >
          <MdEject />
        </div>
      </div>
    </div>
  );
}
