import imagem from "../../assets/logo.png";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import "./NotFound.css";
import { useNavigate } from "react-router-dom";

export function NotFound() {
  const navegarHome = useNavigate();
  const navegarLogin = useNavigate();

  return (
    <div className="notFound">
      <div>
        <img width="400" src={imagem} alt="" />
        <br />
        <h1>Ops!</h1>
        <br />
        <h1 className="titulo"> Página não encontrada. </h1>
      </div>
      <br />
      <ButtonGroup size="lg" className="mb-2">
        <Button variant="secondary" onClick={() => navegarHome("/")}>
          Home
        </Button>
        <Button variant="dark" onClick={() => navegarLogin("/login")}>
          Login
        </Button>

      </ButtonGroup>
    </div>
  );
}
