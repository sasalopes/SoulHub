import {
    createUserWithEmailAndPassword,
    FacebookAuthProvider,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    getAuth,
    signOut,
  } from "firebase/auth";
  import { auth, db  } from "./config";
  import  FotoPerfil from "../assets/images/perfil/semFotoPerfil.png";
import { novoUsuario } from "./usuarios";
import {doc, getDoc, setDoc } from "firebase/firestore";
   // Função assíncrona = que o resultado não é obtido de imediato
  // Haverá "espera"
  export async function cadastrarEmailSenha(email, senha) {
    // Indicar para o firebase que queremos cadastrar
    // um novo usuário utilizando email/senha
  
    // Aguardando o resultado do Firebase
    const resultado = await createUserWithEmailAndPassword(auth, email, senha);
    const {user} = resultado;
    // Adicionar dados à coleção "usuarios" no Firestore
    await novoUsuario({uid:user.uid, email:user.email})
    return resultado.user;
  }
  
  export async function loginEmailSenha(email, senha) {
    // Vai realizar o login com uma conta de email já existente
    const resultado = await signInWithEmailAndPassword(auth, email, senha);
  
    return resultado.user;
  }
    
  export async function loginGoogle() {
    const provider = new GoogleAuthProvider();
    const resultado = await signInWithPopup(auth, provider);
    const user = resultado.user;
  
    // Armazenar os dados do usuário no Firestore Database
    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      // O usuário não existe, então armazenar os dados do usuário no Firestore
      const userData = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        cidade: null,
        estado: null,
        sobre: null,
        linkInstagran: null,
        linkLinkedin: null,
        linkFacebook: null,
        linkGithub: null
        // Outros dados que você deseja armazenar
      };
  
      await setDoc(userRef, userData);
    }
  
    return user;
  }

  
  export async function loginFacebook() {
    const provider = new FacebookAuthProvider();
    const resultado = await signInWithPopup(auth, provider);
    const user = resultado.user;
  
    // Armazenar os dados do usuário no Firestore Database na coleção 'usersface'
    const userRef = doc(db, 'users', user.uid);
    const userData = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      cidade: null,
      estado: null,
      sobre: null,
      linkInstagran: null,
      linkLinkedin: null,
      linkFacebook: null
      // Outros dados que você deseja armazenar
    };
    await setDoc(userRef, userData);
  
    return user;
  }
  
  export async function loginGithub() {
    const provider = new GithubAuthProvider();
    const resultado = await signInWithPopup(auth, provider);
    const user = resultado.user;
  
    // Armazenar os dados do usuário no Firestore Database na coleção 'usersgit'
    const userRef = doc(db, 'users', user.uid);
    const userData = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      cidade: null,
      estado: null,
      sobre: null,
      linkInstagran: null,
      linkLinkedin: null,
      linkFacebook: null
      // Outros dados que você deseja armazenar
    };
    await setDoc(userRef, userData);
  
    return user;
  }
  
  export async function logout() {
    // Deslogar o usuário atual do firebase
    await signOut(auth);
  }

  export function semFotoPerfil() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user !== null) {

      // Verifique se o usuário possui uma foto de perfil definida
      if (user.photoURL) {
        return user.photoURL; // Retorna a URL da foto de perfil do usuário
      }
      else {
        const fotoPadrao = FotoPerfil;
        return fotoPadrao;
      }
    }

    // Caso o usuário não tenha uma foto de perfil definida, retorne a URL da foto de perfil padrão
    const fotoPadrao = FotoPerfil;
    return fotoPadrao;}

