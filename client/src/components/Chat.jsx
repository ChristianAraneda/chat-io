import React from "react";
import estilos from "./Chat.module.css";
import { Button } from "bootstrap";

const rooms = ["general", "random", "jokes", "javescript"];

export default function Chat(props) {
  function renderRooms(room) {
    const currentChat = {
      chatName: room,
      isChannel: true,
      receiverId: "",
    };
    return (
      <div
        className={estilos.row}
        onClick={() => props.toggleChat(currentChat)}
        key={room}>
        {room}
      </div>
    );
  }

  function renderUser(user) {
    if (user.id === props.yourId) {
      return (
        <div className={estilos.row} key={user.id}>
          You: {user.name}
        </div>
      );
    }
    const currentChat = {
      chatName: user.username,
      isChannel: false,
      receiverId: user.id,
    };
    return (
      <div
        className={estilos.row}
        onClick={() => {
          props.toggleChat(currentChat);
        }}
        key={user.id}>
        {user.username}
      </div>
    );
  }
  function renderMessages(message, index) {
    return (
      <div key={index}>
        <h4>{message.sender}</h4>
        <p>{message.content}</p>
      </div>
    );
  }

  let body;
  if (
    !props.currentChat.isChannel ||
    props.connectedRooms.includes(props.currentChat.chatName)
  ) {
    body = (
      <div className={estilos.messages}>
        {props.messages.map(renderMessages)}
      </div>
    );
  } else {
    body = (
      <button
        onClick={() => {
          props.joinRoom(props.currentChat.chatName);
        }}>
        Unirse a {props.currentChat.chatName}
      </button>
    );
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      props.sendMessage();
    }
  }

  return (
    <div className={estilos.container}>
      <div className={estilos.sidebar}>
        <h3>Channels</h3>
        {rooms.map(renderRooms)}
        <h3>All users</h3>
        {props.allUsers.map(renderUser)}
      </div>
      <div className={estilos.chatPanel}>
        <div className={estilos.chanelInfo}>{props.currentChat.chatName}</div>
        <div className={estilos.bodyContainer}>{body}</div>
        <textarea
          className="textBox"
          value={props.message}
          onChange={props.handleMessageChange}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje"></textarea>
      </div>
    </div>
  );
}
