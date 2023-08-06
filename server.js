const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const startServer = async () => {
    const fetch = (await import('node-fetch')).default; // Import node-fetch using dynamic import

    const app = express();
    const server = http.createServer(app);
    const io = socketIo(server);

    const API_KEY = '598d5895d26249a0ba9f00811a46a07e';
    const BASE_URL = 'https://open.er-api.com/v6/latest';

    app.use(express.static('public'));

    io.on('connection', (socket) => {
        console.log('A user connected.');

        socket.on('convert', async ({ from, to, amount }) => {
            try {
                const response = await fetch(`${BASE_URL}/${from}`);
                const data = await response.json();

                if (data.error) {
                    socket.emit('conversionResult', { success: false });
                } else {
                    const rate = data.rates[to];
                    const convertedAmount = amount * rate;

                    socket.emit('conversionResult', {
                        success: true,
                        from,
                        to,
                        amount,
                        convertedAmount,
                    });
                }
            } catch (error) {
                console.error('Error fetching conversion data:', error);
                socket.emit('conversionResult', { success: false });
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected.');
        });
    });

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
};

startServer().catch((error) => {
    console.error('Error starting the server:', error);
});
