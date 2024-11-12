require('dotenv').config();
const express = require('express');
const Stream = require('node-rtsp-stream');
const app = express();
const logger = require('./src/utils/logger');
const cameraRoutes = require('./src/routes/cameraRoutes');

app.use(express.json());
app.use(express.static('public')); // Servir arquivos estáticos a partir da pasta 'public'

app.use('/camera', cameraRoutes);

// Armazenamento em memória para as câmeras
let cameras = {};

// Endpoint para cadastrar uma nova câmera
app.post('/camera', (req, res) => {
    const { name, rtspUrl } = req.body;

    if (!name || !rtspUrl) {
        return res.status(400).json({ error: 'Nome e URL RTSP são obrigatórios' });
    }

    if (cameras[name]) {
        return res.status(400).json({ error: 'Câmera já cadastrada' });
    }

    // Gerar WebSocket para a câmera
    const wsPort = 9999 + Object.keys(cameras).length;  // Incrementa o número da porta WebSocket dinamicamente
    Stream.ffmpegPath = process.env.PATH_FFMPEG || 'C:/ffmpeg/bin/ffmpeg.exe';

    const stream = new Stream({
        name,
        streamUrl: rtspUrl,
        wsPort,
        ffmpegOptions: {
            '-stats': '',
            '-r': 15,
            '-s': '1280x720',
            '-rtsp_transport': 'tcp',
            '-c:v': 'mjpeg',
            '-f': 'mjpeg',
            '-loglevel': 'debug',
        }
    });

    // Armazenar as informações da câmera
    cameras[name] = { rtspUrl, wsPort };

    logger.info(`Câmera ${name} registrada com sucesso, stream RTSP: ${rtspUrl}`);

    return res.status(201).json({ message: 'Câmera cadastrada com sucesso', wsPort });
});

// Endpoint para listar todas as câmeras cadastradas
app.get('/cameras', (req, res) => {
    res.json(cameras);
});

// Endpoint para acessar o stream de uma câmera específica
app.get('/video/:name', (req, res) => {
    const cameraName = req.params.name;
    const camera = cameras[cameraName];

    if (!camera) {
        return res.status(404).json({ error: 'Câmera não encontrada' });
    }

    res.sendFile(__dirname + '/public/index.html');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    logger.info(`API rtsp-to-mjpeg rodando na porta: ${port}`);
});