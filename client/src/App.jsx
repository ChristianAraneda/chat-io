import { useState, useRef, useEffect } from "react";
import Form from "./components/UsernameForm";
import Chat from "./components/Chat";
import io from "socket.io-client";
import immer from "immer";
import "./App.css";

const initialMessagesState = {
  general: [],
  random: [],
  jokes: [],
  javascript: [],
};

function App() {
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);
  const [currentChat, setCurrentChat] = useState({
    isChannel: true,
    chatName: "general",
    receiverId: "",
  });
  const [connectedRooms, setConnectedRooms] = useState(["general"]);
  const [allUsers, serAllUsers] = useState([]);
  const [messages, setMessages] = useState(initialMessagesState);
  const [message, setMessage] = useState("");
  const socketRef = useRef();

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  function sendMessage() {
    const payload = {
      content: message,
      to: currentChat.isChannel ? currentChat.chatName : currentChat.receiverId,
      sender: username,
      chatName: currentChat.chatName,
      isChannel: currentChat.isChannel,
    };
    socketRef.current.emit("send message", payload);
    const newMessages = immer(messages, (draft) => {
      draft[currentChat.chatName].push({
        sender: username,
        content: message,
      });
    });
    setMessages(newMessages);
  }

  let body;
  if (connected) {
    body = (
      <Chat
        message={message}
        handleMessageChange={handleMessageChange}
        sendMessage={sendMessage}
        yourId={socketRef.current ? socketRef.current.id : ""}
        allUsers={allUsers}
        joinRoom={joinRoom}
        connectedRooms={connectedRooms}
        currentChat={currentChat}
        toggleChat={toggleChat}
        messages={messages[currentChat.chatName]}
      />
    );
  } else {
    body = (
      <Form username={username} onChange={handleChange} connect={connect} />
    );
  }

  return <div className="App">{body}</div>;
}

export default App;
