require('dotenv').config();
const express = require('express');
const Stream = require('node-rtsp-stream');
const app = express();

app.use(express.static('public')); // Servir arquivos estáticos a partir da pasta 'public'

// Caminho para o stream RTSP da câmera
const rtspUrl = 'rtsp://admin:binar0570@hikdevice.biofinger.com.br:554/dac/realplay/B21545E4-B96D-2E4F-BC23-4016F16DC3D31/MAIN/TCP?streamform=rtp';

Stream.ffmpegPath = process.env.PATH_FFMPEG || 'C:/ffmpeg/bin/ffmpeg.exe';
// Configure o WebSocket para transmitir o vídeo
const stream = new Stream({
    name: 'hikvision',
    streamUrl: rtspUrl,
    wsPort: 9999,  // WebSocket port
    ffmpegOptions: {
        '-stats': '',               // Mostra informações de estatísticas no console
        '-r': 15,                   // Define a taxa de quadros (FPS)
        '-s': '1280x720',            // Define a resolução de saída
        //'-q:v': '1',                // Define a qualidade do vídeo (quanto menor, melhor a qualidade)
        //'-buffer_size': '1000',     // Tamanho do buffer
        //'-max_delay': '1000',       // Tempo máximo de espera para consumir pacotes RTP
        '-rtsp_transport': 'tcp',
        //'-preset': 'slow',
        '-c:v': 'mjpeg',
        '-f': 'mjpeg',         // Força a saída como MJPEG
        '-loglevel': 'debug',   // Define o nível de log para debug
    }
});

// Rota de acesso ao vídeo via WebSocket
app.get('/video', (req, res) => {
    //res.send('WebSocket da câmera iniciado em ws://localhost:9999');
    res.sendFile(__dirname + '/public/index.html');
});

// Rota para acessar o WebSocket diretamente (opcional)
app.get('/websocket', (req, res) => {
    res.send('Acesse o stream RTSP via WebSocket em ws://localhost:9999');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});