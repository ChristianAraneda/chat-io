import estilos from "./Chat.module.css";

function ChatCliente(props) {
  console.log("propiedades cliente", props);
  function renderMessages(message, index) {
    console.log("miraaaaa", message);
    console.log(message);
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
export default ChatCliente;
