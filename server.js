const { Server } = require('socket.io');
const http = require('http');

const app = require('./src/app');
const GameController = require('./src/utils/Game.controller');
const { getRandomColorFromGame } = require('./src/utils/helpers');
const PlayerController = require('./src/utils/Player.controller');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('CREATE_PLAYER', async ({ nick }) => {
    const gameController = new GameController();

    const freeGame = await gameController.findFreeGame();
    const color = await getRandomColorFromGame(freeGame);

    const { create } = new PlayerController();
    const player = await create({ nick, color });
    await gameController.addPlayer(freeGame._id, player._id);
    socket.join(freeGame._id.toString());

    const user = {
      id: player._id, gameId: freeGame._id, color, nick,
    };

    const players = await gameController.getPlayers(freeGame._id);
    socket.emit('JOIN_LOBBY', { user, players });

    socket.playerId = player._id;
    socket.gameId = freeGame._id;

    const roomId = `${freeGame._id.valueOf()}`;
    io.to(roomId).emit('UPDATE_LOBBY', players);
  });

  socket.on('CHANGE_STATUS', async (values) => {
    const gameController = new GameController();

    const playerController = new PlayerController();
    await playerController.update(socket.playerId, values);

    const players = await gameController.getPlayers(socket.gameId);
    const roomId = `${socket.gameId.valueOf()}`;
    io.to(roomId).emit('UPDATE_LOBBY', players);
  });
});

const PORT = process.env.PORT || 4000;

app.set('port', PORT);

server.listen(app.get('port'), () => {
  console.log(`Serwer is running on ${PORT} port`);
});
