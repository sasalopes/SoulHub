import React, { useState, useEffect, useContext } from "react";
import { Button, Container, Card, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  getPostagensByUserId,
  deletePost,
  updatePosts,
} from "../../firebase/posts";
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
import { addComment, getComments } from "../../firebase/posts";
import { ChatLeft, HeartFill } from "react-bootstrap-icons";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import "./MinhasPostagens.css";
import Carregamento from "../../components/Carregamento/Carregamento";

export function MinhasPostagens() {
  const [minhasPostagens, setMinhasPostagens] = useState([]);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [comments, setComments] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState({});
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState([]);
  // Obtém o tema escuro
  const [temaEscuro] = useContext(DarkModeContext);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;
      // Obter as postagens do usuário atual
      getPostagensByUserId(userId)
        .then((resultados) => {
          setMinhasPostagens(resultados);
          loadLikes(resultados);
          loadComments();
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao obter as postagens do usuário:", error);
          setLoading(false);
        });
    }
  }, [currentUser]);

  // Carregar o número de curtidas de cada postagem
  async function loadLikes(posts) {
    const likesData = {};
    for (const post of posts) {
      const likes = await getLikes(post.id);
      likesData[post.id] = likes;
    }
    setLikes(likesData);
  }
  // Obter o número de curtidas de uma postagem específica
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
  // Lidar com o evento de curtir uma postagem
  const handleLikePost = async (postId) => {
    const db = getFirestore();
    const postRef = doc(db, "posts", postId);

    try {
      // Incrementar o número de curtidas da postagem no banco de dados
      await updateDoc(postRef, {
        likes: increment(1),
      });

      console.log("Curtida registrada com sucesso!");

      // Atualizar o estado das curtidas da postagem
      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: (prevLikes[postId] || 0) + 1,
      }));

      setLikedPosts((prevLikedPosts) => {
        if (prevLikedPosts.includes(postId)) {
          return prevLikedPosts.filter((id) => id !== postId);
        } else {
          return [...prevLikedPosts, postId];
        }
      });
    } catch (error) {
      console.error("Erro ao registrar curtida:", error);
    }
  };
  // Carregar os comentários das postagens
  async function loadComments() {
    const commentsData = await getComments();
    setComments(commentsData);
  }
  // Exibir os comentários de uma postagem específica
  const handleShowComments = (postId) => {
    setSelectedPostId(postId);
    setShowComments(true);
  };
  // Fechar o modal de comentários
  const handleCloseComments = () => {
    setSelectedPostId(null);
    setShowComments(false);
  };
  // Enviar um novo comentário
  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (selectedPostId && newComment.trim() !== "") {
      await addComment(selectedPostId, newComment);
      await loadComments();
      setNewComment("");
    }
  };
  // Lidar com o evento de exclusão de uma postagem
  function handleDelete(postId) {
    setPostIdToDelete(postId);
    setShowDeleteModal(true);
  }
  // Confirmar a exclusão de uma postagem
  function confirmDelete() {
    deletePost(postIdToDelete)
      .then(() => {
        setMinhasPostagens((prevPostagens) =>
          prevPostagens.filter((post) => post.id !== postIdToDelete)
        );
        setPostIdToDelete(null);
      })
      .catch((error) => console.error("Erro ao excluir postagem:", error))
      .finally(() => setShowDeleteModal(false));
  }
  // Cancelar a exclusão de uma postagem
  function cancelDelete() {
    setShowDeleteModal(false);
    setPostIdToDelete(null);
  }
  // Lidar com a atualização de uma postagem
  function handleUpdate(postId, { updatedTitle, updatedContent }) {
    const updatedPost = {
      postTitle: updatedTitle,
      postContent: updatedContent,
    };

    updatePosts(postId, updatedPost)
      .then(() => {
        // Atualizar a postagem no estado
        setMinhasPostagens(
          minhasPostagens.map((post) => {
            if (post.id === postId) {
              return { ...post, ...updatedPost };
            } else {
              return post;
            }
          })
        );
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    const db = getFirestore();
    const postsCollection = collection(db, "posts");
    const orderedQuery = query(postsCollection, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(orderedQuery, (snapshot) => {
      const posts = [];
      snapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data() });
      });
      setMinhasPostagens(posts);
      loadLikes(posts);
      loadComments();
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const themeClass = temaEscuro ? "dark" : "light";
  return (
    <Container>
      <Container>
        {loading ? (
          <Carregamento /> // Exibe um componente de carregamento se a página estiver carregando
        ) : (
          <>
            <div className="d-flex justify-content-center mt-2 flex-wrap">
              {minhasPostagens
                .filter((postagem) => postagem.userId === currentUser.uid) // Filtra as postagens pelo ID do usuário atual
                .map((postagem) => {
                  // Verifica se o usuário atual é o autor da postagem
                  const isCurrentUserPost =
                    currentUser && postagem.userId === currentUser.uid;

                  return (
                    <Card
                      key={postagem.id}
                      className="m-3 card-fixed-height shadow bg-body-tertiary rounded col-md-6 border-primary"
                      style={{ width: "24rem", height: "auto" }}
                    >
                      <Card.Img variant="top" src={postagem.urlImage} />
                      <Card.Body>
                        <ProfileImage size={50} userId={postagem.userId} />
                        <Card.Title
                          className="text-end"
                          style={{ fontSize: "16px" }}
                        >
                          {postagem.postTitle}
                        </Card.Title>
                        <p
                          className="text-end"
                          style={{ fontSize: "14px", color: "#6C757D" }}
                        ></p>
                        <Card.Text
                          className="text-end"
                          style={{ fontSize: "14px" }}
                        >
                          {postagem.postContent}
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer className="p-3 card-footer">
                        {isCurrentUserPost && (
                          <div className="d-flex justify-content-between align-items-center g-0">
                            {/* Botão para excluir a postagem */}
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className={`botao-posts btn-custom  text-black  font-weight-bold${themeClass}`}
                              onClick={() => handleDelete(postagem.id)}
                            >
                              <i class="bi bi-trash"></i>
                            </Button>
                            {/* Botão para editar a postagem */}
                            <Link to="/postagem">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                className={`botao-posts btn-custom  text-black  font-weight-bold${themeClass}`}
                                onClick={() => {
                                  const updatedTitle = prompt(
                                    "Digite o novo título:",
                                    postagem.postTitle
                                  );
                                  const updatedContent = prompt(
                                    "Digite o novo conteúdo:",
                                    postagem.postContent
                                  );
                                  handleUpdate(postagem.id, {
                                    updatedTitle,
                                    updatedContent,
                                  });
                                }}
                              >
                                <i class="bi bi-pencil-fill"></i>
                              </Button>
                            </Link>
                            <div className="d-flex justify-content-between  me-2">
                              {/* Botão para curtir a postagem */}
                              <span
                                className={`btn-icon text-dark gap-0.5  ${
                                  temaEscuro ? "dark" : "light"
                                }`}
                                onClick={() => handleLikePost(postagem.id)}
                                style={{ fontSize: "14px" }}
                              >
                                <HeartFill className="botao-curtir" />{" "}
                                <span
                                  className={`curtidas-numero ${
                                    temaEscuro ? "dark" : "light"
                                  }`}
                                >
                                  {likes[postagem.id] || 0}
                                </span>
                              </span>
                              {/* Botão para exibir os comentários */}
                              <span
                                className="btn-icon text-dark me-2 comment-count1"
                                onClick={() => handleShowComments(postagem.id)}
                                style={{ fontSize: "14px" }}
                              >
                                <ChatLeft className="botao-comentar" />
                                <span className="comment-count gap-0.5">
                                  {comments[postagem.id] &&
                                  comments[postagem.id].length > 0
                                    ? comments[postagem.id].length
                                    : 0}{" "}
                                  comentários
                                </span>
                              </span>
                            </div>
                          </div>
                        )}
                      </Card.Footer>
                    </Card>
                  );
                })}
            </div>
          </>
        )}
      </Container>
      {/* Modal de confirmação de exclusão */}
      <Modal show={showDeleteModal} onHide={cancelDelete}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este post?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Deletar
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal para exibir os comentários */}
      <Modal show={showComments} onHide={handleCloseComments}>
        <Modal.Header closeButton>
          <Modal.Title>Comentários</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPostId &&
            comments[selectedPostId] &&
            comments[selectedPostId].map((comment, index) => (
              <div
                key={index}
                className={`comment-wrapper ${temaEscuro ? "dark" : "light"}`}
              >
                <ProfileImage
                  userId={comment.userId}
                  urlImage={comment.urlImage}
                />
                <p>{comment.comment}</p>
                <hr />
              </div>
            ))}
          <form onSubmit={handleSubmitComment}>
            <textarea
              rows="3"
              placeholder="Digite um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className={temaEscuro ? "textarea-preta" : ""}
            ></textarea>
            <button type="submit">Publicar</button>
          </form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
