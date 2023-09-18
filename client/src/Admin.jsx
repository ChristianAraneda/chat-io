import { useState, useRef, useEffect } from "react";
import Form from "./components/UsernameForm";
import Chat from "./components/Chat";
import io from "socket.io-client";
import immer from "immer";
import "./App.css";

const initialMessagesState = {};

export const Admin = () => {
  const [username, setUsername] = useState({
    username: "AutoConnect",
    id: "1234567890",
  });
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    chatName: "",
    receiverId: "",
  });
  const [connectedRooms, setConnectedRooms] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [message, setMessage] = useState([]);
  const socketRef = useRef();

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  useEffect(() => {
    setMessage("");
    console.log("miraaaaaaa", initialMessagesState);
  }, [messages]);

  function sendMessage() {
    const payload = {
      content: message,
      to: currentChat.receiverId,
      sender: username.username,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
    };
    socketRef.current.emit("send message", payload);
    const newMessages = immer(messages, (draft) => {
      draft[currentChat.chatName].push({
        sender: username.username,
        content: message,
      });
    });
    setMessages(newMessages);
  }

  function toggleChat(currentChat) {
    console.log("AHORA SI", currentChat);
    if (!messages[currentChat.chatName]) {
      const newMessages = immer(messages, (draft) => {
        draft[currentChat.chatName] = [];
      });

      setMessages(newMessages);
    }
    setCurrentChat(currentChat);
  }

  function connect() {
    setConnected(true);
    socketRef.current = io.connect("/");
    socketRef.current.emit("join server", username);
    socketRef.current.on("new user", (allUsers) => {
      setAllUsers(allUsers);
    });
    socketRef.current.on("new message", ({ content, sender, chatName }) => {
      setMessages((messages) => {
        const newMessages = immer(messages, (draft) => {
          if (draft[chatName]) {
            draft[chatName].push({ content, sender });
          } else {
            draft[chatName] = [{ content, sender }];
          }
        });
        return newMessages;
      });
    });
  }

  let body;
  if (connected) {
    body = (
      <Chat
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        yourId={"3456789"}
        //  cambie id por ids
        allUsers={allUsers}
        connectedRooms={connectedRooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
      />
    );
  } else {
    body = (
      <form>
        <button onClick={connect}>Conectarse como Admin</button>
      </form>
    );
  }

  return <div> {body} </div>;
};
