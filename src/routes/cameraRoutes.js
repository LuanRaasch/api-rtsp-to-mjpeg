const express = require('express');
const router = express.Router();

const CameraController = require('../controllers/cameraController');

router.post('/cadastrar', CameraController.cadastrarCamera);
router.get('/listar', CameraController.camerasCadastradas);
router.get('/video/:name', CameraController.acessarVideo);
router.delete('/remover/:name', CameraController.removerCamera);

module.exports = router;