class Camera {
    constructor(name, rtspUrl, wsPort) {
        this.nome = name;
        this.rtspUrl = rtspUrl;
        this.wsPort = wsPort;
    };
};

module.exports = Camera;