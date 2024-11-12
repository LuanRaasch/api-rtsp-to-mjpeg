const winston = require('winston');

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf, errors } = format;

// Define um formato customizado para os logs
const logFormat = printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}] : ${stack || message}`;
});

// Cria o logger
const logger = createLogger({
    level: 'info',  // Nível mínimo de log, pode ser: 'info', 'warn', 'error', etc.
    format: combine(
        timestamp(),  // Adiciona o timestamp
        errors({ stack: true }),  // Para registrar erros com stack trace
        logFormat
    ),
    transports: [
        new transports.Console({ format: combine(format.colorize(), logFormat) }),  // Para exibir os logs no console
        new transports.File({ filename: 'logs/app.log', level: 'info' })  // Para salvar os logs em um arquivo
    ],
});

module.exports = logger;
