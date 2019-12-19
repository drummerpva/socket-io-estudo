import React, { useRef } from "react";
import { FaList as FAMenu, FaSearch as FASearch } from "react-icons/fa";
import { MdEject } from "react-icons/md";
import { FiChevronDown as FAChevronDown } from "react-icons/fi";

export default function SideBar(props) {
  // console.log(props);
  const userRef = useRef();
  const { chats, activeChat, user, setActiveChat, logout } = props;
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
      <div className="search">
        <i className="search-icon">
          <FASearch />
        </i>
        <input placeholder="Search" type="text" />
        <div className="plus"></div>
      </div>
      <div
        className="users"
        ref={userRef}
        onClick={e => {
          e.target === userRef && setActiveChat(null);
        }}
      >
        {chats.map(chat => {
          if (chat.name) {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const user = chat.users.find(({ name }) => {
              return name !== this.props.name;
            }) || { name: "Community" };
            const classNames =
              activeChat && activeChat.id === chat.id ? "active" : "";

            return (
              <div
                key={chat.id}
                className={`user ${classNames}`}
                onClick={() => {
                  setActiveChat(chat);
                }}
              >
                <div className="user-photo">{user.name[0].toUpperCase()}</div>
                <div className="user-info">
                  <div className="name">{user.name}</div>
                  {lastMessage && (
                    <div className="last-message">{lastMessage.message}</div>
                  )}
                </div>
              </div>
            );
          }

          return null;
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
