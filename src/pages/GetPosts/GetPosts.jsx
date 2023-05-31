import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Card, Modal } from "react-bootstrap";
import { getPostagens, addComment, getComments } from "../../firebase/posts";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import ProfileImage from "../../components/ProfileImage/ProfileImage";
import {
  getFirestore,
  collection,
  getDoc,
  doc,
  updateDoc,
  increment,
  query,
  orderBy,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { DarkModeContext } from "../../contexts/DarkModeContext";

import "./GetPosts.css";
import { ChatLeft, HeartFill, PlusCircle } from "react-bootstrap-icons";
import Carregamento from "../../components/Carregamento/Carregamento";

export function GetPosts() {
  const [postagens, setPostagens] = useState([]);
  const [comments, setComments] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(true);
  const [temaEscuro] = useContext(DarkModeContext);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    initializeTable();
  }, []);

  // Função para inicializar a tabela (carregar postagens e comentários)
  async function initializeTable() {
    await Promise.all([loadPostagens(), loadComments()]); // Aguarda o carregamento de postagens e comentários
    setLoading(false); // Define o estado de carregamento para falso após o carregamento completo

    // Escuta em tempo real as alterações na coleção de postagens e atualiza a lista de postagens
    const db = getFirestore();
    const postsRef = collection(db, "posts");
    const query = query(postsRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(query, (snapshot) => {
      const updatedPostagens = [];
      snapshot.forEach((doc) => {
        const postagem = doc.data();
        postagem.id = doc.id;
        updatedPostagens.push(postagem);
      });
      setPostagens(updatedPostagens);
    });

    // Função de limpeza para desregistrar o listener quando o componente é desmontado
    return () => unsubscribe();
  }

  // Função para carregar as postagens
  async function loadPostagens() {
    const db = getFirestore();
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc")); // Ordena as postagens por data de criação em ordem decrescente
    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostagens(posts);

    const likesData = {};
    for (const post of posts) {
      const likes = await getLikes(post.id);
      likesData[post.id] = likes;
    }
    setLikes(likesData);
  }
  // Função para obter o número de curtidas de uma postagem
  async function getLikes(postId) {
    const db = getFirestore();
    const postRef = doc(collection(db, "posts"), postId);
    const postSnapshot = await getDoc(postRef);

    if (postSnapshot.exists()) {
      const postData = postSnapshot.data();
      return postData.likes || 0;
    } else {
      return 0;
    }
  }
  // Função para lidar com o clique no botão de curtir uma postagem
  const handleLikePost = async (postId) => {
    const db = getFirestore();
    const postRef = doc(db, "posts", postId);

    try {
      await updateDoc(postRef, {
        likes: increment(1),
      });

      console.log("Curtida registrada com sucesso!");

      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: (prevLikes[postId] || 0) + 1,
      }));
    } catch (error) {
      console.error("Erro ao registrar curtida:", error);
    }
  };
  // Função para carregar os comentários
  async function loadComments() {
    const commentsData = await getComments();
    setComments(commentsData);
  }

  // Função para exibir os comentários de uma postagem
  const handleShowComments = (postId) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };
  // Função para fechar a exibição dos comentários
  const handleCloseComments = () => {
    setSelectedPostId(null);
    setShowComments(false);
  };
  // Função para lidar com o envio de um novo comentário
  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (selectedPostId && newComment.trim() !== "") {
      await addComment(selectedPostId, newComment);
      await loadComments();
      setNewComment("");
    }
  };

  return (
    <Container>
      {loading ? (
        <Carregamento /> // Exibe um componente de carregamento se a página estiver carregando
      ) : (
        <>
          <div className="d-flex justify-content-center mt-2">
            <Link to="/posts">
              <Button className="" variant="primary">
                <PlusCircle /> Nova postagem
              </Button>
            </Link>
          </div>
          <div className="d-flex flex-wrap justify-content-center align-items-center flex-column gap-1">
            {postagens.map((postagem) => (
              <Card
                key={postagem.id}
                className="m-3 card-fixed-height shadow bg-body-tertiary rounded"
                style={{ width: "60%", height: "auto" }}
              >
                <Card.Img
                  variant="top"
                  alt={postagem.postTitle}
                  src={postagem.urlImage}
                />
                <Card.Body>
                  <Card.Title className="text-end" style={{ fontSize: "16px" }}>
                    {postagem.postTitle}
                  </Card.Title>
                  <p
                    className="text-end"
                    style={{ fontSize: "14px", color: "#6C757D" }}
                  >
                    <ProfileImage
                      size={50}
                      userId={postagem.userId}
                      showName={false}
                    />
                  </p>

                  <Card.Text className="text-end" style={{ fontSize: "14px" }}>
                    {postagem.postContent}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="p-3">
                  <div className="d-flex justify-content-between gap-2">
                    <span
                      className="btn-icon text-dark"
                      onClick={() => handleLikePost(postagem.id)}
                      style={{ fontSize: "14px" }}
                    >
                      {" "}
                      <HeartFill className="likes-postagem" />{" "}
                      <span
                        className={`curtidas-numero1 ${
                          temaEscuro ? "dark" : "light"
                        }`}
                      >
                        {likes[postagem.id] || 0}
                        {/* Exibe o número de curtidas da postagem */}
                      </span>
                    </span>
                    <span
                      className="btn-icon text-dark"
                      onClick={() => handleShowComments(postagem.id)}
                      style={{ fontSize: "14px" }}
                    >
                      <ChatLeft className="coment-postagem" />
                      {/* Exibe o número de comentários da postagem */}
                      <span className="comment-count">
                        {comments[postagem.id] &&
                        comments[postagem.id].length > 0
                          ? comments[postagem.id].length
                          : 0}{" "}
                        comentários
                      </span>
                    </span>
                  </div>
                </Card.Footer>
              </Card>
            ))}
          </div>

          <Modal show={showComments} onHide={handleCloseComments}>
            <Modal.Header closeButton>
              <Modal.Title>Comentários</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Exibição dos comentários */}
              {selectedPostId &&
                comments[selectedPostId] &&
                comments[selectedPostId].map((comment, index) => (
                  <div key={index} className="comment">
                    <div className="profile-image">
                      <ProfileImage
                        userId={comment.userId}
                        urlImage={comment.urlImage}
                      />
                    </div>
                    <p className={temaEscuro ? "comment-text-dark" : ""}>
                      {comment.comment}
                    </p>
                    <hr className={temaEscuro ? "divider-line-dark" : ""} />
                  </div>
                ))}
              {/* Formulário para adicionar um novo comentário */}
              <form onSubmit={handleSubmitComment}>
                <textarea
                  rows="3"
                  placeholder="Digite um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button type="submit" className="publish-button">
                  Publicar
                </button>
              </form>
            </Modal.Body>
          </Modal>
        </>
      )}
    </Container>
  );
}
