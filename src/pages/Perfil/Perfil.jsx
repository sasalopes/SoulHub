import React from "react";
import { Alert, Button, Container, Nav, Form, Modal } from "react-bootstrap";
import "./Perfil.css";
import { semFotoPerfil } from "../../firebase/auth";
import { Carregamento } from "../../components/Carregamento/Carregamento";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { getUser } from "../../firebase/usuarios";
import { IdContext } from "../../contexts/IdContext";
import { Link, NavLink } from "react-router-dom";
import {
  UserFacebookContext,
  UserInstagranContext,
  UserLinkedinContext,
  UserNameContext,
  UserCidadeContext,
  UserEstadoContext,
  UserEmailContext,
  UserSobreContext,
} from "../../contexts/UserContext";
import {
  Facebook,
  Instagram,
  Linkedin,
  PencilSquare,
} from "react-bootstrap-icons";
import "../../components/GitHubAPI/GitHubAPI.css";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import { uploadPhoto } from "../../firebase/usuarios";
import { UserPhotoContext } from "../../contexts/UserPhotoContext";
import { toast } from "react-hot-toast";

const Perfil = () => {
  const semUsuario = "Usuário anônimo";
  const usuarioLogado = useContext(AuthContext);
  const userId = useContext(IdContext);
  const [loading, setLoading] = useState(true);
  const [fotoPerfil, setFotoPerfil] = useState(semFotoPerfil);
  const [usuario, setUsuario] = useState(semUsuario);
  const [idUser, setIdUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [temaEscuro] = useContext(DarkModeContext);
  const [file, setFile] = useState(null);
  const [novaFotoPerfil, setNovaFotoPerfil] = useState(null);
  const { setUserPhoto } = useContext(UserPhotoContext);
  const { userPhoto } = useContext(UserPhotoContext);
  const [show, setShow] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [carregandoFoto, setCarregandoFoto] = useState(false);
  const { updateUserPhoto } = useContext(UserPhotoContext);
   const dataPhoto = useContext(UserPhotoContext);
   const dataName = useContext(UserNameContext);
   const dataEmail = useContext(UserEmailContext);
   const dataSobre = useContext(UserSobreContext);
   const dataFacebook = useContext(UserFacebookContext);
   const dataInstagram = useContext(UserInstagranContext);
   const dataLinkedin = useContext(UserLinkedinContext);
   const dataCidade = useContext(UserCidadeContext);
   const dataEstado = useContext(UserEstadoContext);

  const handleUpload = async (selectedFile) => {
    try {
      setCarregandoFoto(true); // Inicia o estado de carregamento da foto

      // Faz o upload da foto para o servidor
      await uploadPhoto(userId, selectedFile);

      // Atualiza o estado da nova foto somente se o upload for bem-sucedido
      setNovaFotoPerfil(URL.createObjectURL(selectedFile));
      setUserPhoto(URL.createObjectURL(selectedFile)); // Atualiza a foto do perfil no contexto

      setCarregandoFoto(false); // Finaliza o estado de carregamento da foto
    } catch (error) {
      console.log("Erro ao fazer upload da imagem:", error);
      setCarregandoFoto(false); // Finaliza o estado de carregamento da foto mesmo em caso de erro
    }
    setFile(selectedFile);
  };

  useEffect(() => {
    getUser(userId)
      .then((user) => {
        if (user) {
          if (usuarioLogado !== null && userPhoto !== null) {
            setFotoPerfil(user.photoURL || semFotoPerfil);
            setUsuario(user.name || semUsuario);
          } else {
            setFotoPerfil(semFotoPerfil);
            setUsuario(user.name || semUsuario);
          }
        } else {
          setFotoPerfil(semFotoPerfil);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados do usuário:", error);
        setLoading(false);
      });
  }, [usuarioLogado, userPhoto, userId]);
  

  if (loading) {
    return <Carregamento />;
  }

  //Função para chamar o Modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const themeClass = temaEscuro ? "dark" : "light";

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Alterar foto de perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFile" className="mb-3">
              <label htmlFor="fileInput" className="pencilIcon">
                <span className="custom-button-p">Selecione uma imagem</span>
              </label>
              <Form.Control
                type="file"
                id="fileInput"
                onChange={handleFileInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={() => handleUpload(selectedFile)}>
            {carregandoFoto ? (
              <span>Enviando...</span>
            ) : (
              <span>Enviar foto</span>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      <div className={`perfil ${themeClass} align-items-center`}>
        <Nav variant="pills" className={themeClass} defaultActiveKey="/home">
          <Nav.Item>
            <NavLink
              to="/perfil"
              className={`nav-link ${themeClass}`}
              activeClassName="active"
              fotoPerfil={userPhoto}
            >
              Perfil
            </NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink
              to="/github"
              className={`nav-link ${themeClass}`}
              activeClassName="active"
            >
              GitHub
            </NavLink>
          </Nav.Item>
          <Nav.Item className="ms-auto">
            <Nav.Link as={NavLink} to="/EditarPerfil" active>
              <PencilSquare /> Editar perfil
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Container
          className={`perfilCard ${themeClass} align-items-center border border-primary rounded`}
        >
          <div className={`fotoCard d-flex flex-column gap-4 ${themeClass}`}>
            <img
              src={novaFotoPerfil ? novaFotoPerfil : fotoPerfil}
              width="180px"
              height="180px"
              alt="fotoPerfil"
              className="rounded-circle fotoPerfil"
            ></img>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <Button variant="primary" onClick={handleShow}>
              <PencilSquare className="me-2" /> Alterar foto
            </Button>
          </div>
          <div className={`perfilInfo ${themeClass}`}>
            <h2>
              <b>{usuario}</b>
            </h2>
          </div>
          <div className=" perfilInfo">
            <p className="text">
              <h2 className="m-0">
                <b>20</b>
              </h2>
              <h5 className="m-0">Seguidores</h5>
            </p>
          </div>
          <div className={`perfilInfo ${themeClass}`}>
            <p className={`text-Light ${themeClass}`}>
              <h2 className="m-0">
                <b>20</b>
              </h2>
              <h5 className="m-0">Seguindo</h5>
            </p>
          </div>
        </Container>
        <Container
          className={`perfilCard2 ${themeClass} border border-primary rounded`}
        >
          <div className={`detalhes ${themeClass}`}>
            <b>Detalhes</b>
            <br />
            <br />
            <dl className="details">
              <dt>Conta ID:</dt>
              <dd>{userId}</dd>

              <dt>Nome:</dt>
              <dd>{dataName}</dd>

              <dt>Email:</dt>
              <dd>{dataEmail}</dd>

              <dt>Cidade:</dt>
              <dd>{dataCidade}</dd>

              <dt>Estado:</dt>
              <dd>{dataEstado}</dd>
            </dl>
          </div>
          <div className="detalhes text-break">
            <b>Sobre</b>
            <br />
            {dataSobre}
          </div>
          <div className="detalhes">
            <b>Links sociais</b>
            <br />
            <br />
            <dl className="d-flex socialList flex-wrap align-items-center">
              <Link to={`https://facebook.com/${dataFacebook}`} target="_blank">
                <Alert className="me-2">
                  <div className="d-flex align-items-center m-2">
                    <Button className="socialButton">
                      <Facebook className="iconeSocial" />
                    </Button>
                    <div className="ms-2">
                      <b>facebook.com/</b>
                      {dataFacebook}
                    </div>
                  </div>
                </Alert>
              </Link>
              <Link
                to={`https://instagram.com/${dataInstagram}`}
                target="_blank"
              >
                <Alert className="me-2">
                  <div className="d-flex align-items-center m-2">
                    <Button className="socialButton">
                      <Instagram className="iconeSocial" />
                    </Button>
                    <div className="ms-2">
                      <b>instagram.com/</b>
                      {dataInstagram}
                    </div>
                  </div>
                </Alert>
              </Link>
              <Link
                to={`https://linkedin.com/in/${dataLinkedin}`}
                target="_blank"
              >
                <Alert>
                  <div className="d-flex align-items-center m-2">
                    <Button className="socialButton">
                      <Linkedin className="iconeSocial" />
                    </Button>
                    <div className="ms-2">
                      <b>linkedin.com/in/</b>
                      {dataLinkedin}
                    </div>
                  </div>
                </Alert>
              </Link>
            </dl>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Perfil;
