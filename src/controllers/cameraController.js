const logger = require('../utils/logger');
const Camera = require('../models/camera');

let cameras = {};

cadastrarCamera = (req, res) => {
    try {
        const { name, rtspUrl } = req.body;

        if (!name || !rtspUrl) {
            return res.status(400).json({ error: 'Nome e URL RTSP são obrigatórios' });
        };

        if (cameras[name]) {
            return res.status(400).json({ error: 'Câmera já cadastrada' });
        };

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

        return res.status(201).json({ message: 'Câmera cadastrada com sucesso', wsPort });
    } catch (error) {
        logger.error(`Erro ao cadastrar câmera.`);
    };
};

camerasCadastradas = (req, res) => {
    try {
        res.json(cameras);
    } catch (error) {
        logger.error(`Erro ao retornar câmeras cadastradas.`);
    };
};

acessarVideo = (req, res) => {
    try {
        const cameraName = req.params.name;
        const camera = cameras[cameraName];

        if (!camera) {
            return res.status(404).json({ error: 'Câmera não encontrada' });
        }

        res.sendFile(__dirname + '/public/index.html');
    } catch (error) {
        logger.error(`Erro ao retornar câmeras cadastradas.`);
    }
};

module.exports = { cadastrarCamera, camerasCadastradas, acessarVideo };