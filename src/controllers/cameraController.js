require('dotenv').config();
const logger = require('../utils/logger');
const Camera = require('../models/camera');
const Stream = require('node-rtsp-stream');
const path = require('path');
const fs = require('fs');


let cameras = {}; //Armazena as câmeras em memória   
let streams = {}; // Armazena os streams para gerenciamento

let availablePorts = Array.from({ length: 100 }, (_, i) => 10001 + i); // Portas de 10001 até 10099

function allocatePort() {
    if (availablePorts.length > 0) {
        return availablePorts.pop(); // Retira a última porta disponível
    } else {
        throw new Error('Nenhuma porta disponível');
    };
};

cadastrarCamera = (req, res) => {
    try {
        const { name, rtspUrl } = req.body;

        if (!name || !rtspUrl) {
            return res.status(400).json({ error: 'Nome e URL RTSP são obrigatórios' });
        };

        if (Camera.exists(name, cameras)) {
            return res.status(400).json({ error: 'Câmera já cadastrada' });
        };

        const wsPort = allocatePort(); // Aloca uma porta do pool
        const camera = Camera.createCamera(name, rtspUrl, wsPort);

        // Gerar WebSocket para a câmera
        //Stream.ffmpegPath = process.env.PATH_FFMPEG || 'C:/ffmpeg/bin/ffmpeg.exe';

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

        // Armazenar as informações e o stream da câmera
        cameras[name] = { rtspUrl, wsPort };
        streams[name] = stream;

        return res.status(201).json({ camera: camera });
    } catch (error) {
        logger.error(`Erro ao cadastrar câmera: ${error.message}`);
        return res.status(500).json({ error: 'Erro interno ao cadastrar câmera' });
    };
};

camerasCadastradas = (req, res) => {
    try {
        res.json(cameras);
    } catch (error) {
        logger.error(`Erro ao retornar câmeras cadastradas: ${error.message}`);
        return res.status(500).json({ error: 'Erro interno ao retornar câmeras cadastradas' });
    };
};

acessarVideo = (req, res) => {
    try {
        const cameraName = req.params.name;
        const camera = cameras[cameraName];

        if (!camera) {
            return res.status(404).json({ error: 'Câmera não encontrada' });
        };

        //const wsUrl = process.env.HOST_SOCKET + ':' + camera.wsPort || 'http://10.0.1.73:' + camera.wsPort; // URL do WebSocket específica da câmera
        const wsUrl = (process.env.HOST_SOCKET ? process.env.HOST_SOCKET : 'ws://10.0.1.73') + ':' + camera.wsPort;

        // Carrega o HTML e insere o WebSocket dinamicamente
        const filePath = path.join(__dirname, '../../public/index.html');
        fs.readFile(filePath, 'utf8', (err, html) => {
            if (err) {
                logger.error(`Erro ao carregar HTML: ${err.message}`);
                return res.status(500).json({ error: 'Erro interno ao carregar a página' });
            }

            // Insere o wsUrl diretamente no JavaScript do HTML
            const modifiedHtml = html.replace(
                '<script>',
                `<script>
                    const wsUrl = "${wsUrl}";
                `
            );

            res.send(modifiedHtml);
        });
    } catch (error) {
        logger.error(`Erro ao acessar vídeo: ${error.message}`);
        return res.status(500).json({ error: 'Erro interno ao acessar vídeo' });
    };
};

removerCamera = (req, res) => {
    try {
        const { name } = req.params;

        if (!Camera.exists(name, cameras)) {
            return res.status(404).json({ error: 'Câmera não encontrada' });
        };

        // Fechar o stream associado à câmera
        const stream = streams[name];
        if (stream) {
            stream.stop(); // Para o processo FFmpeg e o WebSocket
            delete streams[name];
        };

        // Remover a câmera do objeto 'cameras'
        Camera.removeCamera(name, cameras);

        return res.status(200).json({ message: 'Câmera removida com sucesso' });
    } catch (error) {
        logger.error(`Erro ao remover câmera: ${error.message}`);
        return res.status(500).json({ error: 'Erro interno ao remover câmera' });
    };
};

module.exports = { cadastrarCamera, camerasCadastradas, acessarVideo, removerCamera };