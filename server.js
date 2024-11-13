require('dotenv').config();
const express = require('express');
const app = express();
const logger = require('./src/utils/logger');
const cameraRoutes = require('./src/routes/cameraRoutes');

app.use(express.json());
app.use(express.static('public')); // Servir arquivos estáticos a partir da pasta 'public'

app.use('/camera', cameraRoutes);

const port = process.env.PORT || 10000;
app.listen(port, () => {
    logger.info(`API rtsp-to-mjpeg rodando na porta: ${port}`);
});