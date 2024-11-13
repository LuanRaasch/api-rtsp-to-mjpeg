# API BIOSINCRONIZA

Esta é a API para transmissões de stream via RTSP, ela é responsável por pegar o fluxo RTSP e converter para MJPEG.

## Tecnologias Usadas

- **Node.js**: Ambiente de execução JavaScript.
- **node-rtsp-stream**: Biblioteca para conversão de Stream RTSP.
- **Winston**: Ferramenta para exibição de logs.
- **dotenv**: Configuração de váriaveis de ambiente.

## Configuração do Projeto

### Pré-requisitos

- Node.js (v12 ou superior)
- FFMPEG instalado no lado do servidor.

### Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/api-rtsp-to-mjpeg.git
   cd api-biosincroniza-nodejs

2. Instale as dependências:
   ```terminal
   npm install

3. Configure as variáveis de ambiente: 
   Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis:
   ```
   PORT=porta do servidor
   PATH_FFMPEG=caminho de instalação do FFMPEG
   HOST_SOCKET=host do socket de cada câmera

5. Inicie o servidor:
   ```
   node server.js

## Rotas

### 1. `POST /camera/cadastrar`
**Descrição:** Cadastra uma nova câmera.

**Corpo da Requisição:**
```json
{
    "name": "nome da câmera",
    "rtspUrl": "rtsp://user:senha@url_do_rtsp"
}
```
### 2. `GET /camera/listar`
**Descrição:** Câmeras cadastradas.

### 3. `DEL /camera/remover/nomeDaCamera`
**Descrição:** Para a conversão do fluxo RTSP, fecha o socket e destrói os objetos relacionados a ela.

### 3. `GET /camera/video/nomeDaCamera`
**Descrição:** Retorna a página HTML com a stream em execução.


