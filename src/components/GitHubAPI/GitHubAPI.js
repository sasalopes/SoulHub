import React, { useState } from 'react';
import axios from 'axios';
import './GitHubAPI.css';

function GitHubAPI() {
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarURL, setAvatarURL] = useState("");
  const [publicRepos, setpublicRepos] = useState("");
  const [followers, setfollowers] = useState("");
  const [following, setfollowing] = useState("");

  const handleSearch = () => {
    axios
      .get(`https://api.github.com/users/${userName}`)
      .then((res) => {
        setName(res.data.name);
        setBio(res.data.bio);
        setAvatarURL(res.data.avatar_url);
        setpublicRepos(res.data.public_repos);
        setfollowers(res.data.followers);
        setfollowing(res.data.following);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="github-container">
      <div className="github-wrapper">
        <header className="header-top">
          <ul>
            <li className="soulhub">SoulHub</li>
          </ul>
        </header>
        <main>
          <div className="form">
            <h3 className="title">Buscador de Perfis do GITHUB</h3>
            <input
              type="text"
              placeholder="Digite um username"
              onChange={(e) => setUserName(e.target.value)}
              className="input-username"
            />
            <button onClick={handleSearch} className="button-search">Buscar</button>
          </div>
          <div className="content">
            <div className="profile">
              <img src={avatarURL} alt="Perfil" className="profile-image" />
              <h3 className="profile-name">{name}</h3>
              <h5 className="profile-repos">Número de Repositórios: {publicRepos}</h5>
              <h5 className="profile-followers">Seguidores: {followers}</h5>
              <h5 className="profile-following">Seguindo: {following}</h5>
              <p className="profile-bio">{bio}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default GitHubAPI;
