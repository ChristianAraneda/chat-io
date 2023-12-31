import estilos from "./Chat.module.css";

function Chat(props) {
  console.log("Admin cliente", props);
  function renderUser(user) {
    if (user.id === props.yourId) {
      return (
        <div className={estilos.row} key={user.id}>
          YOUUUUUU: {user.name}
        </div>
      );
    }
    const currentChat = {
      chatName: user.username,
      isChannel: false,
      receiverId: user.id,
    };
    console.log("current chat", currentChat);
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

  const filteredUsers = props.allUsers?.filter(
    (user) => user.id !== "12345678907"
  );

  function renderMessages(message, index) {
    return (
      <div key={index}>
        <div>
          <h4>{message.sender}</h4>
        </div>
        <div>
          <p>{message.content}</p>
        </div>
      </div>
    );
  }

  let body;

  body = (
    <div className={estilos.messages}>
      {props.messages?.map(renderMessages)}
    </div>
  );

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault(), props.sendMessage();
    }
  }

  return (
    <div className={estilos.container}>
      {props.yourId === "3456789" && (
        <div className={estilos.sidebar}>
          <h3>All users</h3>
          {filteredUsers?.map(renderUser)}
        </div>
      )}
      <div className={estilos.chatPanel}>
        <div className={estilos.chanelInfo}>{props.currentChat.chatName}</div>
        <div className={estilos.bodyContainer}>{body}</div>
        <textarea
          className={estilos.textBox}
          value={props.message}
          onChange={props.handleMessageChange}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu mensaje"></textarea>
      </div>
    </div>
  );
}
export default Chat;
