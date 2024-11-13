# Use uma imagem base com Node.js
FROM node:18

# Instalar o FFmpeg no contêiner
RUN apt-get update && apt-get install -y ffmpeg

# Atualiza a lista de pacotes e instala o nano
RUN apt-get update && apt-get install -y nano

# Defina o diretório de trabalho
WORKDIR /app

# Copie os arquivos de dependência
COPY package*.json ./
RUN npm install

# Copie o restante do código da API
COPY . .

# Exponha a porta da API
EXPOSE 3000

# Comando para iniciar a API
CMD ["npm", "start"]
