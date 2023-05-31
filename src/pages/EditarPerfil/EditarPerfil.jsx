import React from "react";
import { Col, Container, Form, InputGroup, Nav, Row } from "react-bootstrap";
import "./EditarPerfil.css";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { getUser, updateUser } from "../../firebase/usuarios";
import { toast } from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import Carregamento from "../../components/Carregamento/Carregamento";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import { BoxArrowInDown } from "react-bootstrap-icons";

const EditarPerfil = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const usuarioLogado = useContext(AuthContext);
  const [dadosUsuario, setDadosUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [temaEscuro] = useContext(DarkModeContext);

  useEffect(() => {
    if (!usuarioLogado) {
      navigate("/login"); // Replace "/login" with the desired login page URL
    } else {
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
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [usuarioLogado, setValue, navigate]);

  const atualizarUsuario = async (data) => {
    try {
      const usuarioAtualizado = {
        ...dadosUsuario,
        email: data.email,
        name: data.name,
        cidade: data.cidade,
        estado: data.estado,
        sobre: data.sobre,
        linkInstagram: data.linkInstagram,
        linkFacebook: data.linkFacebook,
        linkLinkedin: data.linkLinkedin,
        linkGithub: data.linkGithub,
      };

      await updateUser(usuarioLogado.uid, usuarioAtualizado);

      toast.success("Perfil editado com sucesso!", {
        duration: 2000,
        position: "bottom-right",
      });

      navigate("/perfil");
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      toast.error("Erro ao editar perfil. Por favor, tente novamente.", {
        duration: 2000,
        position: "bottom-right",
      });
    }
  };

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
          <Nav.Link
            as={NavLink}
            onClick={handleSubmit(atualizarUsuario)}
            type="submit"
            active
          >
            <BoxArrowInDown /> Salvar perfil
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Container
        className={`EditarPerfilCard ${themeClass} border border-primary rounded`}
      >
        <Form onSubmit={handleSubmit(atualizarUsuario)} className="form">
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={1}>
              Email
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                size="lg"
                defaultValue={dadosUsuario?.email || ""}
                className={` ${themeClass} ${errors.email && "is-invalid"}`}
                {...register("email", {
                  required: "Email é obrigatório!",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres!",
                  },
                })}
              />
              <Form.Text className={`text-danger ${themeClass}`}>
                {errors.email?.message}
              </Form.Text>
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className={`mb-3 ${themeClass}`}
            controlId="formHorizontalEmail"
          >
            <Form.Label column sm={1}>
              Nome
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                size="lg"
                defaultValue={dadosUsuario?.name || ""}
                className={` ${themeClass} ${errors.name && "is-invalid"}`}
                {...register("name", {
                  required: "Nome é obrigatório!",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres!",
                  },
                })}
              />
              <Form.Text className={`text-danger ${themeClass}`}>
                {errors.name?.message}
              </Form.Text>
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className={`mb-3 ${themeClass}`}
            controlId="formHorizontalEmail"
          >
            <Form.Label column sm={1}>
              Cidade
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                size="lg"
                defaultValue={dadosUsuario?.cidade || ""}
                className={` ${themeClass} ${errors.cidade && "is-invalid"}`}
                {...register("cidade", {
                  required: "Cidade é obrigatório!",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres!",
                  },
                })}
              />
              <Form.Text className="text-danger">
                {errors.cidade?.message}
              </Form.Text>
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className={`mb-3 ${themeClass}`}
            controlId="formHorizontalEmail"
          >
            <Form.Label column sm={1}>
              Estado
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                size="lg"
                defaultValue={dadosUsuario?.estado || ""}
                className={` ${themeClass} ${errors.Estado && "is-invalid"}`}
                {...register("estado", {
                  required: "Nome é obrigatório!",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres!",
                  },
                })}
              />
              <Form.Text className={`text-danger ${themeClass}`}>
                {errors.estado?.message}
              </Form.Text>
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className={`mb-3 ${themeClass}`}
            controlId="formHorizontalEmail"
          >
            <Form.Label column sm={1}>
              Sobre
            </Form.Label>
            <Col sm={8}>
              <InputGroup>
                <Form.Control
                  type="text"
                  size="lg"
                  defaultValue={dadosUsuario?.sobre || ""}
                  {...register("sobre")}
                  style={{ height: "100px" }}
                  placeholder="Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut perspiciatis expedita ex, voluptas molestiae eos aspernatur unde, minima, eligendi incidunt porro dignissimos! Voluptatem maxime aliquam veniam, quasi perspiciatis error at?"
                  as="textarea"
                  aria-label="With textarea"
                  className={` ${themeClass} ${errors.sobre && "is-invalid"}`}
                />
              </InputGroup>
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className={`mb-3 ${themeClass}`}
            controlId="formHorizontalEmail"
          >
            <Form.Label column sm={1}>
              Instagram
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                size="lg"
                defaultValue={dadosUsuario?.linkInstagran || ""}
                className={` ${themeClass} ${
                  errors.linkInstagran && "is-invalid"
                }`}
                {...register("linkInstagran", {
                  required: "Instagram é obrigatório!",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres!",
                  },
                })}
              />
              <Form.Text className={`text-danger ${themeClass}`}>
                {errors.linkInstagran?.message}
              </Form.Text>
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className={`mb-3 ${themeClass}`}
            controlId="formHorizontalEmail"
          >
            <Form.Label column sm={1}>
              Facebook
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                size="lg"
                defaultValue={dadosUsuario?.linkFacebook || ""}
                className={` ${themeClass} ${
                  errors.linkFacebook && "is-invalid"
                }`}
                {...register("linkFacebook", {
                  required: "Facebook é obrigatório!",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres!",
                  },
                })}
              />
              <Form.Text className={`text-danger ${themeClass}`}>
                {errors.linkFacebook?.message}
              </Form.Text>
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className={`mb-3 ${themeClass}`}
            controlId="formHorizontalEmail"
          >
            <Form.Label column sm={1}>
              Linkedin
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                size="lg"
                defaultValue={dadosUsuario?.linkLinkedin || ""}
                className={` ${themeClass} ${
                  errors.linkLinkedin && "is-invalid"
                }`}
                {...register("linkLinkedin", {
                  required: "Linkedin é obrigatório!",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres!",
                  },
                })}
              />
              <Form.Text className={`text-danger ${themeClass}`}>
                {errors.linkLinkedin?.message}
              </Form.Text>
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className={`mb-3 ${themeClass}`}
            controlId="formHorizontalEmail"
          >
            <Form.Label column sm={1}>
              GitHub
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                size="lg"
                defaultValue={dadosUsuario?.linkGithub || ""}
                className={` ${themeClass} ${
                  errors.linkGithub && "is-invalid"
                }`}
                {...register("linkGithub", {
                  required: "GitHub é obrigatório!",
                  maxLength: {
                    value: 255,
                    message: "Limite de 255 caracteres!",
                  },
                })}
              />
              <Form.Text className={`text-danger ${themeClass}`}>
                {errors.linkGithub?.message}
              </Form.Text>
            </Col>
          </Form.Group>
        </Form>
      </Container>
    </Container>
  );
};

export default EditarPerfil;
