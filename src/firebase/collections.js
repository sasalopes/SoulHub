import { db } from "./config";
import { collection } from "firebase/firestore";

export const postagens = collection(db, "postagens");
export const postsCollection = collection(db, "posts");
export const usersCollection = collection(db, "users");
export const comentariosCollection  = collection(db, "comentarios");
