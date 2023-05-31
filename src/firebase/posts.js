import {addDoc, deleteDoc, doc, getDoc, getDocs, updateDoc, getFirestore,FieldValue, query, where, orderBy } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { postsCollection,comentariosCollection  } from "./collections";
import { storage } from "./config"
import { getAuth } from "firebase/auth";
import { collection } from "firebase/firestore";

// Função para enviar uma postagem
export async function enviarPostagem(data) {
  const userId = getAuth().currentUser.uid;
  const createdAt = new Date(); // Obtenha a data atual
  
  const postagemData = {
    ...data,
    userId: userId,
    createdAt: createdAt 
  };

  await addDoc(postsCollection, postagemData);
}
// Função para obter todas as postagens
export async function getPostagens() {
    const snapshot = await getDocs(postsCollection);
    let postagens = [];
    snapshot.forEach(doc => {
        postagens.push({...doc.data(), id: doc.id});
    })
    return postagens;
}   
// Função para obter uma postagem específica pelo ID
export async function getPost(id) {
    const document = await getDoc(doc(postsCollection, id));
    return {...document.data(), id: document.id};
}
// Função para atualizar uma postagem
export async function updatePosts(id, data) {
    await updateDoc(doc(postsCollection, id), data);
}
// Função para deletar uma postagem
export async function deletePost(id) {
    await deleteDoc(doc(postsCollection, id));
}
// Função para fazer upload de um arquivo/imagem
export async function uploadArquivo(imagem) {
    const filename = imagem.name;
    const imageRef = ref(storage, `postar/${Date.now()}${filename}`);;
    const result = await uploadBytes(imageRef, imagem);
    return await getDownloadURL(result.ref);
}
// Função para obter todas as postagens de um determinado usuário pelo ID do usuário
export async function getPostagensByUserId(userId) {
  const db = getFirestore();
  const postsCollection = collection(db, "posts");
  const query = query(
    postsCollection,
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  try {
    const snapshot = await getDocs(query);
    const postagens = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return postagens;
  } catch (error) {
    console.error("Erro ao obter as postagens do usuário:", error);
    return [];
  }
}
// Função para adicionar um comentário a uma postagem
export async function addComment(postId, comment) {
  const userId = getAuth().currentUser.uid;
  const urlImage = getAuth().currentUser.photoURL;
  const commentData = {
    postId,
    userId,
    comment,
    urlImage,
  };
  await addDoc(comentariosCollection, commentData);
}
// Função para obter todos os comentários das postagens
export async function getComments() {
  const snapshot = await getDocs(comentariosCollection);
  let comments = {};
  snapshot.forEach((doc) => {
    const commentData = doc.data();
    const postId = commentData.postId;
    if (!comments[postId]) {
      comments[postId] = [];
    }
    comments[postId].push(commentData);
  });
  return comments;
}
// Função para obter os dados de um usuário pelo ID do usuário
export async function getUser(userId) {
  const db = getFirestore();
  const userRef = doc(db, "users", userId);

  try {
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return userData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return null;
  }
}
// Função para obter o número de curtidas de uma postagem
export async function getLikes(postId) {
  const db = getFirestore();
  const postRef = doc(db, "posts", postId);
  const postSnapshot = await getDoc(postRef);

  if (postSnapshot.exists()) {
    const postData = postSnapshot.data();
    return postData.likes || 0;
  } else {
    return 0;
  }
}
// Função para adicionar uma curtida a uma postagem
export async function addLike(postId) {
  const db = getFirestore();
  const postRef = doc(db, "posts", postId);

  try {
    await updateDoc(postRef, {
      likes: FieldValue.increment(1)
    });
    console.log("Curtida adicionada com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar curtida:", error);
  }
}