import styles from "./styles.module.scss";
import logoImg from "../../assets/logo.svg";
import { useEffect, useState } from "react";
import io from 'socket.io-client';
import { api } from "../../services/api";

type Message = {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
};

const messageQueue: Message[] = [];

const socket = io('http://localhost:4000');
socket.on('new_message', (newMessage: Message) => {
  messageQueue.push(newMessage);
});

function MessageList() {
  //uso do state
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setInterval(() => {
      if(messageQueue.length > 0){
        setMessages(prevState => [
          messageQueue[0],
          prevState[0],
          prevState[1]
        ].filter(Boolean)); // filtra se o valor for undefined ou null

        messageQueue.shift();
      }
    }, 3000);
  },[]);

  useEffect(() => {
    //chamada pra api
    api.get<Message[]>("messages/last3").then((response) => {
      setMessages(response.data);
    });
  }, []);

  return (
    <div className={styles.messageListWrapper}>
      <img src={logoImg} alt="DoWhile2021" />

      <ul className={styles.messageList}>
        {messages.map((message) => {
          return (
            <li key={message.id} className={styles.message}>
              <p className={styles.messageContent}>{message.text}</p>
              <div className={styles.messageUser}>
                <div className={styles.userImage}>
                  <img
                    src={message.user.avatar_url}
                    alt={message.user.name}
                  />
                </div>
                <span>{message.user.name}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { MessageList };
