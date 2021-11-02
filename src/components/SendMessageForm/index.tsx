import { FormEvent, useContext, useState } from "react";
import { VscSignOut } from "react-icons/vsc";
import { AuthContext } from "../../contexts/auth";
import { api } from "../../services/api";
import styles from "./styles.module.scss";

function SendMessageForm() {
  const { user, signOut } = useContext(AuthContext);
  const [message, setMessage] = useState("");

   async function handleSendMessage(event: FormEvent){
      event.preventDefault(); // Impede o html de enviar o usuário pra outra página
      if(!message.trim()){
         return;
      }

      await api.post('messages', { message });

      setMessage(''); // limpa o campo textArea
   }

  return (
    <div className={styles.sendMessageFormWrapper}>
      <button onClick={signOut} className={styles.signOutButton}>
        <VscSignOut size="32" />
      </button>

      <header className={styles.userInformation}>
        <div className={styles.userImage}>
          <img src={user?.avatar_url} alt={user?.name} />
        </div>
        <strong className={styles.userName}>{user?.name}</strong>
        <span className={styles.userGithub}>{user?.login}</span>
      </header>

      <form onSubmit={ handleSendMessage } className={styles.sendMessageForm}>
        <label htmlFor="message">Mensagem</label>
        <textarea
          onChange={(event) => setMessage(event.target.value)}
          name="message"
          id="message"
          placeholder="Qual sua espectativa para o evento?"
          value={message}
        ></textarea>
        <button type="submit">Enviar mensagem</button>
      </form>
    </div>
  );
}

export { SendMessageForm };
