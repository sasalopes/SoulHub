import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import './BemVindo.css';
import logo from "../../assets/logo.png";

function BemVindo() {
  return (
    <div className="BemVindo">
      <header className="BemVindo-header">
        <Container>
          <Row>
            <Col>
              <img src={logo} width="100%" alt="Logo" />
            </Col>
          </Row>
        </Container>
      </header>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://magazine25.vteximg.com.br/arquivos/ids/205311-1000-1000/Lettering-Transfer-para-Balao-Bem-Vindo-Preto-Parabens-22X18-cm----1-Unidade.jpg?v=637426733886870000"
            alt="First slide"
          />
          <Carousel.Caption>
            <h3>SoulHub</h3>
            <p>Bem vindo a maior plataforma de rede social SoulHub. Aqui, celebramos e promovemos a inclusão, unindo pessoas de origens diversas em um ambiente virtual acolhedor e seguro.  </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://iberbussola.pt/wp-content/uploads/2021/05/66206-min-scaled-1-980x713.jpg"
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>Diversidade</h3>
            <p>Nossa rede social é projetada para conectar indivíduos de diferentes culturas, etnias, orientações sexuais, identidades de gênero, habilidades e origens socioeconômicas. Valorizamos a singularidade de cada pessoa e incentivamos a expressão autêntica de quem você é..</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://engenharia360.com/wp-content/uploads/2019/09/redes-sociais-Beatriz-Zanut-Engenharia-360-1.jpg"
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Nossa Platafoma</h3>
            <p>Ao ingressar em nossa plataforma, você terá a oportunidade de criar um perfil personalizado, compartilhar suas experiências, interesses e aspirações com uma comunidade inclusiva e receptiva. .</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
export default BemVindo;

