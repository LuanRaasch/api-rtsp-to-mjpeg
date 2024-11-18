# # Defina a imagem base como Ubuntu
# FROM ubuntu:20.04

# # Use uma imagem base com Node.js
# FROM node:20

# # Instalar o FFmpeg no contêiner
# RUN apt-get update && apt-get install -y ffmpeg

# # Atualiza a lista de pacotes e instala o nano
# RUN apt-get update && apt-get install -y nano

# # Defina o diretório de trabalho
# WORKDIR /usr/src/rtsp-to-mjpeg

# # Copie os arquivos de dependência
# COPY package*.json ./
# RUN npm install

# # Copie o restante do código da API
# COPY . .

# # Exponha a porta da API
# # EXPOSE 10000

# # Comando para iniciar a API
# CMD ["npm", "start"]

# Defina a imagem base como Ubuntu
FROM ubuntu:20.04

# Instalar dependências necessárias
RUN apt-get update && apt-get install -y \
    curl \
    software-properties-common \
    nano \
    && rm -rf /var/lib/apt/lists/*

# Instalar o Node.js
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Defina o diretório de trabalho
WORKDIR /usr/src/rtsp-to-mjpeg

# Copie os arquivos de dependência
COPY package*.json ./

# Instale as dependências do Node.js
RUN npm install

# Copie o restante do código da API
COPY . .

# Exponha a porta da API
# EXPOSE 10000

# Comando para iniciar a API
CMD ["npm", "start"]
