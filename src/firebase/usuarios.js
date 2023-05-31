
import { doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./config";
import { getStorage, ref, uploadBytes  } from "firebase/storage";
import { getDownloadURL } from "firebase/storage";
import { usersCollection } from "./collections"

// import { usersCollection } from "./collections";

export async function novoUsuario(data) {
  const docRef = doc(db, "users" , data.uid);
  await setDoc(docRef, data);
}

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

export async function updateUser(userId, data, file) {
  const userRef = doc(db, "users", userId);

  try {
    const updateData = {
      email: data.email,
      name: data.name,
      sobre: data.sobre,
      cidade: data.cidade,
      estado: data.estado,
      linkInstagran: data.linkInstagran,
      linkFacebook: data.linkFacebook,
      linkLinkedin: data.linkLinkedin,
      linkGithub: data.linkGithub
    };

    if (file) {
      // Se um novo arquivo foi selecionado, faça o upload da foto
      await uploadPhoto(userId, file);
      
      // Obtenha o URL da foto do armazenamento
      const photoURL = await getDownloadURL(ref(storage, `users/${userId}/photo.jpg`));
      
      // Atualize o URL da foto no objeto de atualização
      updateData.photoURL = photoURL;
    }

    await updateDoc(userRef, updateData);

    console.log("Dados do usuário atualizados com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar dados do usuário:", error);
  }
}

const storage = getStorage();
export async function uploadPhoto(userId, file) {
  const storageRef = ref(storage, `users/${userId}/photo.jpg`);
  
  try {
    await uploadBytes(storageRef, file);
    const photoURL = await getDownloadURL(storageRef);
    
    // Atualize o documento do usuário com a nova URL da foto
    await updateDoc(doc(usersCollection, userId), { photoURL });
    
    console.log("Upload de foto concluído com sucesso!");
  } catch (error) {
    console.error("Erro ao fazer o upload de foto:", error);
  }
}







