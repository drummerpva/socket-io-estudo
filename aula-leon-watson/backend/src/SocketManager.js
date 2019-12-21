const {
  VERIFY_USER,
  USER_CONNECTED,
  USER_DISCONNECTED,
  LOGOUT,
  MESSAGE_RECIEVED,
  COMMUNITY_CHAT,
  MESSAGE_SENT,
  TYPING,
  PRIVATE_MESSAGE,
  NEW_CHAT_USER
} = require("./Events");

const { createUser, createMessage, createChat } = require("./Factories");
let connectedUsers = {};
let communityChat = createChat({ isCommunity: true });
module.exports = (io, socket) => {
  console.log(`Socket conectado: `, socket.id);

  let sendMessageToChatFromUser;

  let sendTypingFromUser;

  //Verifica o usuario
  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({ isUser: true, user: null });
    } else {
      callback({
        isUser: false,
        user: createUser({ name: nickname, socketId: socket.id })
      });
    }
  });

  //Usuario conectado com username
  socket.on(USER_CONNECTED, user => {
    user.socketId = socket.id;
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user;
    sendMessageToChatFromUser = sendMessageToChat(io, user.name);
    sendTypingFromUser = sendTypingToChat(io, user.name);
    io.emit(USER_CONNECTED, connectedUsers);
    console.log("Connect ", connectedUsers);
  });

  //Usuário desconectou
  socket.on("disconnect", () => {
    if ("user" in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name);
      io.emit(USER_DISCONNECTED, connectedUsers);
      console.log("Disconnect ", connectedUsers);
    }
  });

  //Usuário LogOut
  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name);
    io.emit(USER_DISCONNECTED, connectedUsers);
    console.log("Logout ", connectedUsers);
  });

  //Get Community Chat
  socket.on(COMMUNITY_CHAT, callback => {
    callback(communityChat);
  });

  //Message send
  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    console.log(chatId, message);
    sendMessageToChatFromUser(chatId, message);
  });

  //isTyping
  socket.on(TYPING, ({ chatId, isTyping }) => {
    sendTypingFromUser(chatId, isTyping);
  });

  socket.on(PRIVATE_MESSAGE, ({ reciever, sender, activeChat }) => {
    if (reciever in connectedUsers) {
      const recieverSocket = connectedUsers[reciever].socketId;
      if (activeChat === null || activeChat.id === communityChat.id) {
        const newChat = createChat({
          name: `${reciever}&${sender}`,
          users: [reciever, sender]
        });
        socket.to(recieverSocket).emit(PRIVATE_MESSAGE, newChat);
        socket.emit(PRIVATE_MESSAGE, newChat);
      } else {
        if (!(reciever in activeChat.users)) {
          activeChat.users
            .filter(user => user in connectedUsers)
            .map(user => connectedUsers[user])
            .map(user => {
              socket.to(user.socketId).emit(NEW_CHAT_USER, {
                chatId: activeChat.id,
                newUser: reciever
              });
            });
          socket.emit(NEW_CHAT_USER, {
            chatId: activeChat.id,
            newUser: reciever
          });
        }
        socket.to(recieverSocket).emit(PRIVATE_MESSAGE, activeChat);
      }
    }
  });
};

const sendTypingToChat = (io, user) => {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, { user, isTyping });
  };
};

const sendMessageToChat = (io, sender) => {
  // console.log("sendMessageToChat", sender);
  return (chatId, message) => {
    io.emit(
      `${MESSAGE_RECIEVED}-${chatId}`,
      createMessage({ message, sender })
    );
  };
};

const addUser = (userList, user) => {
  let newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
};

const removeUser = (userList, username) => {
  let newList = Object.assign({}, userList);
  delete newList[username];
  return newList;
};

const isUser = (userList, username) => {
  return username in userList;
};
