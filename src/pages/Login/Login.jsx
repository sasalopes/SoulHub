import {
  Button,
  Card,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import logoIcon from "../../assets/logo.png";
import { InputGroup } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { Github, Google, PersonCircle } from "react-bootstrap-icons";
import {
  loginEmailSenha,
  loginGoogle,
  loginGithub,
} from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import "./Login.css";
import { DarkModeContext } from "../../contexts/DarkModeContext";

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const navigate = useNavigate();
  const [mostrarSenhaV, SetMostrarSenha] = useState(false);
  const [temaEscuro] = useContext(DarkModeContext);


  function entrarSemLogin () {

    navigate("/")
  }

  function onSubmit(data) {
    const { email, senha } = data;
    if (email && senha) {
      // Se o email e senha estiverem preenchidos, será feito o ligin normal.
    loginEmailSenha(email, senha)
      .then((user) => {
        toast.success(`Bem-vindo(a) ${user.email}`, {
          position: "bottom-right",
          duration: 2500,
        });
        navigate("/");
      })
      .catch((erro) => {
        toast.error(`Um erro aconteceu. Código: ${erro.code}`, {
          position: "bottom-right",
          duration: 2500,
        });
      });
    } else {
      // Se o email e senha estiverem vazios, será permitido o acesso sem login.
      entrarSemLogin();
    }
  }


  function onLoginGithub() {
    loginGithub()
      .then((user) => {
        toast.success(`Bem-vindo(a) ${user.email}`, {
          position: "bottom-right",
          duration: 2500,
        });
        navigate("/");
      })
      .catch((erro) => {
        toast.error(`Um erro aconteceu. Código: ${erro.code}`, {
          position: "bottom-right",
          duration: 2500,
        });
      });
  }

  function onLoginGoogle() {
    // then = quando der certo o processo
    loginGoogle()
      .then((user) => {
        toast.success(`Bem-vindo(a) ${user.email}`, {
          position: "bottom-right",
          duration: 2500,
        });
        navigate("/");
      })
      .catch((erro) => {
        // tratamento de erro
        toast.error(`Um erro aconteceu. Código: ${erro.code}`, {
          position: "bottom-right",
          duration: 2500,
        });
      });
  }

  const usuarioLogado = useContext(AuthContext);

  const mostrarSenha = () => {
    SetMostrarSenha(!mostrarSenhaV);
  };

  // Se tiver dados no objeto, está logado
  if (usuarioLogado !== null) {
    navigate("/");
  }
  const themeClass = temaEscuro ? 'dark' : 'light';

  return (
    <>
      <div className="d-flex flex-wrap justify-content-around gap-4 p-4 login">
          <div className="logo-container">
            <img src={logoIcon} width="300"
            alt="Logo do app" />
            <div className="justify-content-start d-flex text-start" ><p> Conectando Desenvolvedores Ideias e Inovação</p> 
            </div>
          </div>
            <div className="align-self-center">
              <Card className="text-center p-2">
              <Card.Title id="Text" className="text-center"></Card.Title>


              <Form className="align-items-center"
              onSubmit={handleSubmit(onSubmit)}>
                <Form.Group
                  className="organizer"
                  type="password"
                  placeholder="Senha"
                >
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    className={`${
                      errors.email && "is-invalid"
                    } email-input`} // Adicione a classe 'email-input' aqui
                    placeholder="Seu email"
                    {...register("email", {
                      required: "O email é obrigatório",
                    })}
                  />
                  <Form.Text className="invalid-feedback">
                    {errors.email?.message}
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Senha</Form.Label>

                  <InputGroup>
                    <Form.Control
                      type={mostrarSenhaV ? "text" : "password"}
                      className={errors.senha && "is-invalid"}
                      placeholder="Sua senha"
                      {...register("senha", {
                        required: "A senha é obrigatória",
                      })}
                      autoComplete="off"
                    />
                    <InputGroup.Text>
                      <a
                        className="mostrarSenha mt-1 mx-1"
                        onClick={mostrarSenha}
                      >
                        <i
                          className={`bi bi-eye${
                            mostrarSenhaV ? "-slash" : ""
                          }`}
                        ></i>
                      </a>
                    </InputGroup.Text>
                  </InputGroup>
                  <Form.Text className="invalid-feedback">
                    {errors.senha?.message}
                  </Form.Text>
                </Form.Group>
                <p className="text-muted">
                Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
              </p>

                <Card className={`button-login ${themeClass}`}>
                  <Button type="submit" variant="success">
                    Login
                  </Button>
                  <hr />
                  <Button
                    className="mb-3 ms-2 githubIcon btnLogin"
                    id="gitIcon"
                    onClick={onLoginGithub}
                  >
                    <Github size={28}  /> Entrar
                    com o Git Hub
                  </Button>

                  <Button
                    className="mb-3 ms-2 btnLogin"
                    variant="danger"
                    onClick={onLoginGoogle}
                  >
                    <Google size={28}  /> Entrar
                    com o Google
                  </Button>

                  <Button
                    className="mb-3 ms-2 btn-facebook entrarSemLogin"
                    onClick={entrarSemLogin} 
                    >
                    <PersonCircle size={28} /> Visitantes
                  </Button>
                </Card>
              </Form>
            </Card></div>
          </div>
          <Toaster />

    </>
  );
}