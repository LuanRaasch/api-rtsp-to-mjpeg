class Camera {
    constructor(name, rtspUrl, wsPort) {
        this.nome = name;
        this.rtspUrl = rtspUrl;
        this.wsPort = wsPort;
    };

    // Método estático para criar uma nova câmera
    static createCamera(name, rtspUrl, wsPort) {
        if (!name || !rtspUrl) {
            throw new Error('Nome e URL RTSP são obrigatórios');
        };
        // Outras validações podem ser adicionadas aqui
        return new Camera(name, rtspUrl, wsPort);
    };

    // Método estático para verificar se a câmera já existe no objeto 'cameras'
    static exists(name, cameras) {
        return Boolean(cameras[name]);
    };

    // Método para remover uma câmera
    static removeCamera(name, cameras) {
        if (cameras[name]) {
            delete cameras[name];
            return true;
        }
        return false;
    };
};

module.exports = Camera;