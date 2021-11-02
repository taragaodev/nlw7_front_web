import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

type User = {
   id: string;
   name: string;
   login: string;
   avatar_url: string;
}

type AuthContextData = {
   user: User | null; // se o usuário não estiver autenticado o usuário vai estar nulo
   signInUrl: string;
   signOut: () => void;
}

const AuthContext = createContext({} as AuthContextData);

type AuthProvider = {
   children: ReactNode;
}
type AuthResponse = {
  token: string;
   user: {
      id: string;
      avatar_url: string;
      name: string;
      login: string;
   }
}

function AuthProvider(props: AuthProvider){

   const [ user, setUser ] = useState<User | null>(null);

   const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=e7d3416123bc14d3aba1`

   async function signIn(githubCode: string){
      const response = await api.post<AuthResponse>('authenticate', {
         code: githubCode,
      });
      
      const { token, user } = response.data;

      localStorage.setItem('@dowhile:token', token);

      api.defaults.headers.common.authorization = `Bearer ${token}`; // 1

      setUser(user);      
   }

   /** Para fazer logout
    * Seto o usuário como nulo
    * removo o token do localStorage
    */
   function signOut(){
      setUser(null);
      localStorage.removeItem('@dowhile:token');
   }
   /** Utilizando o token do usuário para mante-lo logado 
    * Busco o token no localStorage
    * Se existir algo dentro dele eu acesso a rota 'profile' que me retorna o token do usuário
    * Para isso eu preciso enviar o token pelo cabeçalho da requisição (1)
   */
   useEffect(() => {
      const token = localStorage.getItem('@dowhile:token');

      if(token){
         api.defaults.headers.common.authorization = `Bearer ${token}`; // 1

         api.get<User>('profile').then(response => {
            setUser(response.data); // Salvando os dados no state
         });
      };
   },[]);

   useEffect(() => {
      const url = window.location.href;

      const hasGitHubCode = url.includes('?code=');

      if(hasGitHubCode){
         const [ urlWithoutCode, githubCode ] = url.split('?code=');

         window.history.pushState({}, '', urlWithoutCode); // para o usuário não ver o código enviado

         signIn(githubCode);
      }
   },[]);
   return(
      <AuthContext.Provider value={{ signInUrl , user, signOut }}>
         {props.children}
      </AuthContext.Provider>
   );
}
export { AuthProvider, AuthContext };