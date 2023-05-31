import React from "react";
import {
  Alert,
  Button,
  Container,
  Nav,
} from "react-bootstrap";
// import "./EditarPerfil.css";
import { semFotoPerfil } from "../../firebase/auth";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { getUser } from "../../firebase/usuarios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IdContext } from "../../contexts/IdContext";
import Carregamento from "../../components/Carregamento/Carregamento";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import axios from "axios";
import { Github, PencilSquare } from "react-bootstrap-icons";
import { UserGithubContext } from "../../contexts/UserContext";


const GitHub = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const semUsuario = "Usuário anônimo";
  const usuarioLogado = useContext(AuthContext);
  const userId = useContext(IdContext);
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(semFotoPerfil);
  const [usuario, setUsuario] = useState(semUsuario);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [temaEscuro] = useContext(DarkModeContext);
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [publicRepos, setpublicRepos] = useState("");
  const [followers, setfollowers] = useState("");
  const [following, setfollowing] = useState("");
  const dataUserGit = useContext(UserGithubContext);

  useEffect(() => {
    if (usuarioLogado) {
      getUser(usuarioLogado.uid)
        .then((usuario) => {
          if (usuario) {
            setDadosUsuario(usuario);
            setValue("email", usuario.email);
            setValue("name", usuario.name);
            setValue("cidade", usuario.cidade || "");
            setValue("estado", usuario.estado || "");
            setValue("sobre", usuario.sobre || "");
            setValue("linkInstagram", usuario.linkInstagram || "");
            setValue("linkFacebook", usuario.linkFacebook || "");
            setValue("linkLinkedin", usuario.linkLinkedin || "");
            setValue("linkGithub", usuario.linkGithub || "");
          }
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do usuário:", error);
        });
      setLoading(false); // Definir loading como false ao finalizar o carregamento dos dados do usuário
    }
  }, [usuarioLogado, setValue]);

  // ...
  useEffect(() => {
    getUser(userId).then((user) => {
      // Se o usuário estiver logado, usa a foto de perfil dele
      if (usuarioLogado !== null && user.photoURL !== null) {
        setFotoPerfil(user.photoURL);
        setUsuario(user.name);
        if (user.name !== null) {
          setUsuario(user.name);
        } else {
          setUsuario(semUsuario);
        }
      }
      if (usuarioLogado !== null && user.photoURL === null) {
        setFotoPerfil(semFotoPerfil);
        setUsuario(user.name);
        if (user.name !== null) {
          setUsuario(user.name);
        } else {
          setUsuario(semUsuario);
        }
      }
      // Se o usuário não estiver logado, usa o avatar padrão
      else {
        setFotoPerfil(semFotoPerfil);
      }
    });
  });
  console.log(usuario);
  console.log(fotoPerfil);

  const handleSearch = () => {
    axios
      .get(`https://api.github.com/users/${dataUserGit}`)
      .then((res) => {
        setName(res.data.name);
        setBio(res.data.bio);
        setAvatarURL(res.data.avatar_url);
        setpublicRepos(res.data.public_repos);
        setfollowers(res.data.followers);
        setfollowing(res.data.following);
        setLoading(false)
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleSearch();

  if (loading) {
    return <Carregamento />;
  }

  const themeClass = temaEscuro ? "dark" : "light";

  return (
    <Container className={themeClass}>
      <Nav variant="pills" className={themeClass} defaultActiveKey="/home">
        <Nav.Item>
          <NavLink
            to="/perfil"
            className={`nav-link ${themeClass}`}
            activeClassName="active"
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
      <Container className={`EditarPerfilCard ${themeClass} border border-primary rounded`}>
        <div className="content">
          <div className="d-flex justify-content-center gap-4 flex-wrap">
            <img src={avatarURL} alt="Perfil" className="w-40 rounded" />
            <div>
            <Alert variant="primary"><b>Nome:</b> {name}</Alert>
            <Alert variant="primary"><b>Número de Repositórios:</b> {publicRepos}</Alert>
            <Alert variant="primary"><b>Seguidores:</b> {followers}</Alert>
            <Alert variant="primary"><b>Seguindo:</b> {following}</Alert>
            <Alert variant="primary"><b>Biografia:</b> {bio}</Alert></div>
            
          </div>
          <Link to={`https://github.com/${dataUserGit}`} target="_blank" >
              <Alert variant="secondary" className="mt-2">
                <div className="d-flex align-items-center m-2">
                  <Button className="socialButton">
                    <Github className="iconeSocial" />
                  </Button>
                  <div className="ms-2"><b>github.com/</b>{dataUserGit}</div>
                </div>
              </Alert>
              </Link>
        </div>
      </Container>
    </Container>
  );
};

export default GitHub;
