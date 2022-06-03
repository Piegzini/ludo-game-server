const { Server } = require('socket.io');
const http = require('http');

const app = require('./app');
const handleConnection = require('./events');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => handleConnection(socket, io));

module.exports = { server, io };
