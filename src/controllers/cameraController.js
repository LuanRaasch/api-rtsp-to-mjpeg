const logger = require('../utils/logger');
const Camera = require('../models/camera');
const Stream = require('node-rtsp-stream');
const path = require('path');


let cameras = {}; //Armazena as câmeras em memória   
let streams = {}; // Armazena os streams para gerenciamento

cadastrarCamera = (req, res) => {
    try {
        const { name, rtspUrl } = req.body;

        if (!name || !rtspUrl) {
            return res.status(400).json({ error: 'Nome e URL RTSP são obrigatórios' });
        };

        // Verificar se a câmera já existe
        if (Camera.exists(name, cameras)) {
            return res.status(400).json({ error: 'Câmera já cadastrada' });
        };

        // Verifica se os dados estão corretos
        const wsPort = 9999 + Object.keys(cameras).length;
        const camera = Camera.createCamera(name, rtspUrl, wsPort); // Cria a câmera

        // Gerar WebSocket para a câmera
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

        // Armazenar as informações e o stream da câmera
        cameras[name] = { rtspUrl, wsPort };
        streams[name] = stream;

        return res.status(201).json({ message: 'Câmera cadastrada com sucesso', wsPort });
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

        res.sendFile(path.join(__dirname, '../../public/index.html'));
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
    }
};

module.exports = { cadastrarCamera, camerasCadastradas, acessarVideo, removerCamera };