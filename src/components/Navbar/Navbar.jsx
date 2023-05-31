import { useState, useEffect, useContext } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../../assets/logo.png";
import logoDark from "../../assets/logo-black.png";
import "./Navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, semFotoPerfil } from "../../firebase/auth";
import { AuthContext } from "../../contexts/AuthContext";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import {
  ChatSquareTextFill,
  PersonFill,
} from "react-bootstrap-icons";
import { UserNameContext } from "../../contexts/UserContext";
import { UserPhotoContext } from "../../contexts/UserPhotoContext";
import { getUser } from "../../firebase/usuarios";
import { IdContext } from "../../contexts/IdContext";

const LOCAL_STORAGE_KEY = "myApp";

export default function NavBar() {
  const navigate = useNavigate();
  const usuarioLogado = useContext(AuthContext);
  const userId = useContext(IdContext);
  const [fotoPerfil, setFotoPerfil] = useState(semFotoPerfil);
  const dataUserName = useContext(UserNameContext);
  const [temaEscuro, setTemaEscuro] = useContext(DarkModeContext);
  const semUsuario = "Usuário anônimo";
  const [usuario, setUsuario] = useState(semUsuario);
  const [showDropdown, setShowDropdown] = useState(false);
  const primeiroNome = usuario.split(" ")[0];
  const { userPhoto } = useContext(UserPhotoContext);

  useEffect(() => {
    if (usuarioLogado !== null) {
      if (userPhoto !== null) {
        setUsuario(dataUserName !== null ? dataUserName : semUsuario);
      } else {
        setUsuario(dataUserName !== null ? dataUserName : semUsuario);
      }
    } else {
      setUsuario(semUsuario);

    }
  }, [usuarioLogado, userPhoto, dataUserName]);

  // useEffect(() => {
  //   getUser(userId)
  //     .then((user) => {
  //       if (user) {
  //         if (usuarioLogado !== null && userPhoto !== null) {
  //           setFotoPerfil(user.photoURL || semFotoPerfil);
  //           setUsuario(user.name || semUsuario);
  //         } else {
  //           setFotoPerfil(semFotoPerfil);
  //           setUsuario(user.name || semUsuario);
  //         }
  //       } else {
  //         setFotoPerfil(semFotoPerfil);
  //       }

  //     })
  //     .catch((error) => {
  //       console.error("Erro ao buscar dados do usuário:", error);
  //     });
  // }, [usuarioLogado, userPhoto, userId]);
  
  
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    if (data) {
      setTemaEscuro(data.temaEscuro);
    }
  }, [setTemaEscuro]);

  useEffect(() => {
    const data = { temaEscuro, usuario };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [temaEscuro, usuario]);

  function onLogout() {
    logout().then(() => {
      navigate("/login");
    });
  }

  function mudarTema() {
    setTemaEscuro((prevTemaEscuro) => !prevTemaEscuro);
  }

  function toggleDropdown() {
    setShowDropdown((prevShowDropdown) => !prevShowDropdown);
  }

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      bg={temaEscuro ? "dark" : "light"}
      variant={temaEscuro ? "dark" : "light"}
      className={temaEscuro ? "bg-dark" : ""}
    >
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          className={temaEscuro ? "text-white" : ""}
        >
          <img
            src={temaEscuro ? logo : logoDark}
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/postagens" className="btn btn-link">
              Postagens
            </Nav.Link>
          </Nav>
          <div className="welcome-container ms-auto">
            <i
              className={
                temaEscuro
                  ? "bi bi-chat-left-heart-fill text-white"
                  : "bi bi-chat-left-heart-fill"
              }
            ></i>
            <h6 className={temaEscuro ? "text-white" : ""}>
              Olá, {primeiroNome}!
            </h6>
          </div>
          <Nav>
            <NavDropdown
              id="perfil-dropdown"
              title={
                <img
                  src={userPhoto}
                  width="32"
                  height="32"
                  alt="fotoPerfil"
                  className="rounded-circle fotoPerfil"
                  id="fotoPerfil"
                />
              }
              menuVariant={temaEscuro ? "dark" : "light"}
              className="ml-auto mt-auto"
              align="end"
              show={showDropdown}
              onToggle={toggleDropdown}
              drop="center"
            >
              <NavDropdown.Item id="/perfil">
                <img
                  src={userPhoto}
                  width="32"
                  height="32"
                  alt="fotoPerfil"
                  className="rounded-circle fotoPerfil"
                  id="fotoPerfil"
                />
                <h6>{usuario}</h6>
              </NavDropdown.Item>

              {usuarioLogado && (
                <>
                
                  <NavDropdown.Item as={NavLink} to="/perfil">
                    <PersonFill className="me-2" />
                    Meu perfil
                  </NavDropdown.Item>
                  <NavDropdown.Item as={NavLink} to="/postagem">
                    <ChatSquareTextFill className="me-2" />
                    Minhas postagens
                  </NavDropdown.Item>
                </>
              )}
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={mudarTema}>
                <i className={temaEscuro ? "bi bi-sun" : "bi bi-moon"}></i>
              </NavDropdown.Item>
              <NavDropdown.Item onClick={onLogout}>
                <i className="bi bi-box-arrow-right"></i>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
