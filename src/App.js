import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Root } from "./pages/Root/Root";
import { AuthContext } from "./contexts/AuthContext";
import {onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { Login } from "./pages/Login/Login";
import { Cadastro } from "./pages/Cadastro/Cadastro";
import Perfil from "./pages/Perfil/Perfil";
import { Splash } from "./components/Splash/Splash";
import { NotFound } from "./pages/NotsFound/NotFound";
import { DarkModeContext } from "./contexts/DarkModeContext";
import { AdicionarPostagem } from "./pages/AdicionarPostagem/AdicionarPostagem";
import { GetPosts } from "./pages/GetPosts/GetPosts";
import { MinhasPostagens } from "./pages/MinhasPostagens/MinhasPostagens";
import EditarPerfil from "./pages/EditarPerfil/EditarPerfil";
import BemVindo from "./pages/BemVindo/BemVindo";
import "./global.css";
import { IdContext } from "./contexts/IdContext";
import GitHub from "./pages/GitHub/GitHub";
import { getUser } from "./firebase/usuarios";
import { UserEmailContext, UserNameContext, UserGithubContext, UserInstagranContext, UserLinkedinContext, UserFacebookContext, UserEstadoContext, UserCidadeContext, UserSobreContext } from "./contexts/UserContext";

export function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [userId, setUserId] = useState(null);
  const [dataUserName, setDataUserName] = useState(null);
  const [dataUserEmail, setDataUserEmail] = useState(null);
  const [dataUserEstado, setDataUserEstado] = useState(null);
  const [dataUserCidade, setDataUserCidade] = useState(null);
  const [dataUserPhoto, setDataUserPhoto] = useState(null);
  const [dataUserSobre, setDataUserSobre] = useState(null);
  const [dataUserGithub, setDataUserGithub] = useState(null);
  const [dataUserInstagran, setDataUserInstagran] = useState(null);
  const [dataUserLinkedin, setDataUserLinkedin] = useState(null);
  const [dataUserFacebook, setDataUserFacebook] = useState(null);
  const [loading, setLoading] = useState(null);
  const temaEscuro = useState(false);
  


  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUsuarioLogado(user)
      setUserId(usuarioLogado.uid);
      getUser(userId).then((user) =>{
        setDataUserName(user.name)
        setDataUserEmail(user.email)
        setDataUserPhoto(user.photoURL)
        setDataUserSobre(user.sobre)
        setDataUserCidade(user.cidade)
        setDataUserEstado(user.estado)
        setDataUserGithub(user.linkGithub)
        setDataUserInstagran(user.linkInstagran)
        setDataUserLinkedin(user.linkLinkedin)
        setDataUserFacebook(user.linkFacebook)
      })
      ;
    });

    setTimeout(() => {
      setLoading(false);
    }, 2500);

  }, [usuarioLogado, userId]);

  useEffect(() => {
    const body = document.body;
    const [temaEscuroValue] = temaEscuro;

    if (temaEscuroValue) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [temaEscuro]);

  

  return (
    <UserNameContext.Provider value={dataUserName}>
    <UserEmailContext.Provider value={dataUserEmail}>
    <UserEstadoContext.Provider value={dataUserEstado}>
    <UserCidadeContext.Provider value={dataUserCidade}>
    <UserSobreContext.Provider value={dataUserSobre}>
    <UserGithubContext.Provider value={dataUserGithub}>
    <UserLinkedinContext.Provider value={dataUserLinkedin}>
    <UserFacebookContext.Provider value={dataUserFacebook}>
    <UserInstagranContext.Provider value={dataUserInstagran}>
    <AuthContext.Provider value={usuarioLogado}>
      <IdContext.Provider value={userId}>
    <DarkModeContext.Provider value={temaEscuro}>
        <BrowserRouter>
          {loading === true ? (
            <Splash />
          ) : (
            <Routes>
              <Route path="/" element={<Root />}>
                <Route index element={<BemVindo />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/EditarPerfil" element={<EditarPerfil />} />
                <Route path="/github" element={<GitHub />} />
                <Route path="/posts" element={<AdicionarPostagem />} />
                <Route path="/postagens" element={<GetPosts />} />
                <Route path="/postagem" element={<MinhasPostagens />} />
              </Route>
              <Route path="*" element={<NotFound />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
            </Routes>
          )}
        </BrowserRouter>
      </DarkModeContext.Provider>
    </IdContext.Provider>
    </AuthContext.Provider>
    </UserInstagranContext.Provider>
    </UserFacebookContext.Provider>
    </UserLinkedinContext.Provider>
    </UserGithubContext.Provider>
    </UserSobreContext.Provider>
    </UserCidadeContext.Provider>
    </UserEstadoContext.Provider>
    </UserEmailContext.Provider>
    </UserNameContext.Provider>
  );
}

export default App;