import { Button, Container, Form, Breadcrumb} from 'react-bootstrap';
import { enviarPostagem, uploadArquivo } from '../../firebase/posts';
import { toast } from 'react-hot-toast';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./AdicionarPostagem.css";
import { getAuth } from "firebase/auth";
import { DarkModeContext } from "../../contexts/DarkModeContext";
import { useContext } from 'react';
  

export function AdicionarPostagem() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

  // Obtém o usuário autenticado
  const auth = getAuth();
  const currentUser = auth.currentUser;

    // Obtém o tema escuro
  const [temaEscuro] = useContext(DarkModeContext);

  // Função para tratar o envio do formulário
    function onSubmit(data, e) {
      e.preventDefault();

      // Verifica se o usuário está logado
    if (!currentUser) {      
      alert('Você precisa estar logado para postar!');
      return;
    }

    const imagem = data.image[0];

    if (imagem) {
    const toastId = toast.loading("Upload da imagem...", { position: "top-right" });      // Realiza o upload da imagem


      // Realiza o upload da imagem
      uploadArquivo(imagem).then(url => {
        toast.dismiss(toastId);
        data.urlImage = url;
        delete data.image;

      // Envia a postagem para o Firebase Firestore
        enviarPostagem(data).then(() => {
        toast.success("Post adicionado com sucesso!", { duration: 2000, position: "bottom-right" })
        navigate("/postagens");
      })
      })
    } else {
      delete data.imagem;

      // Envia a postagem para o Firebase Firestore
      enviarPostagem(data).then(() => {
        toast.success("Post adicionado com sucesso!", { duration: 2000, position: "bottom-right" })
        navigate("/postagens");
    })
  }
    }

const themeClass = temaEscuro ? 'dark' : 'light'; 
return (
  <Container className='d-flex flex-column page-content'>
    {/* Breadcrumb */}
    <Breadcrumb className='mt-3'>
      <Breadcrumb.Item active>Criar Postagem</Breadcrumb.Item>
    </Breadcrumb>

    {/* Formulário de criação de postagem */}
    <p className='mt-3 text-center'>
      Este é o formulário para criar uma postagem. Preencha os campos abaixo e clique em "Postar" para publicar seu conteúdo.
    </p>
    <div className='postagem'>
      <div className='w-100 ms-5'>
        <Form className='form-post' onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de Título */}
          <Form.Group className={`w-100 mt-3 d-flex align-items-center${themeClass}`}>
            <Form.Label className={`labelPost me-2 customLabel${themeClass}`}>Título:</Form.Label>
            <Form.Control  className={`inputDados ms-4 ${themeClass}`}
              type='text'
              {...register("postTitle", { required: "O título é necessário", maxLength: { value: 128, message: "Limite de 128 caracteres" } })}
            />
            <Form.Text>
              {errors.postTitle?.message}
            </Form.Text>
          </Form.Group>

          {/* Campo de Descrição */}
          <Form.Group className='w-100 mt-3 d-flex align-items-center'>
            <Form.Label className={`labelPost2 me-2 customLabel ${themeClass}`}>Descrição:</Form.Label>
            <Form.Control className={`inputDados2 ms-4 ${themeClass}`}                                                                
              type='text'
              {...register("postContent", { required: "O conteúdo é necessário", maxLength: { value: 800, message: "Limite de 800 caracteres" } })}
            />
            <Form.Text>
              {errors.postContent?.message}
            </Form.Text>
          </Form.Group>

          {/* Upload de Arquivo */}
          <div className='file-upload-container d-flex align-items-center justify-content-center'>
            <label htmlFor='file'  className={`custom-file-upload ms-4 ${themeClass}`}>
              <i class="bi bi-paperclip"></i>
              Arquivo
              <input
                type='file'
                accept='image/video/'
                id='file'
                {...register("image")}
                className='inputFile'
              />
            </label>
            <Form.Text className='text-muted'>
              Adicione uma imagem ou vídeo para a postagem
            </Form.Text>
          </div>

          {/* Botão de Postar */}
          <div className={`text-center${themeClass}`}>
            <Button  type="submit" className="botao-postar ">
              <i class="bi bi-chat-left-heart"></i>
              Postar
            </Button>
          </div>
        </Form>
      </div>
    </div>
  </Container>
);
}






