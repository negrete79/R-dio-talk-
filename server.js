// server.js

// 1. Importar as bibliotecas
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

// 2. Inicializar o servidor
const app = express();
app.use(cors()); // Permite que outras origens (nosso mapa) se conectem
const server = http.createServer(app);
const io = new Server(server, { 
    cors: {
        origin: "*", // Em produção, coloque a URL do seu site aqui!
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

// 3. Criar o endpoint para receber os dados do telefone
app.post('/api/location', express.json(), (req, res) => {
    const { lat, lon } = req.body;
    
    if (!lat || !lon) {
        return res.status(400).send('Latitude e Longitude são obrigatórios.');
    }

    console.log(`🐴 Nova localização recebida: Lat: ${lat}, Lon: ${lon}`);
    
    // 4. Mágica do tempo real: emitir a localização para todos os clientes conectados
    io.emit('new-location', { lat, lon });

    res.status(200).send('Localização recebida com sucesso!');
});

// 5. Iniciar o servidor e ouvir conexões WebSocket
io.on('connection', (socket) => {
    console.log('📡 Um cliente se conectou ao mapa!');
    socket.on('disconnect', () => {
        console.log('❌ Um cliente se desconectou.');
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
