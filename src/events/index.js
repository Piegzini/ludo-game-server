const {
  findFreeGame,
  addPlayerToGame,
  getCurrentGamePlayers,
  checkStartGame, findGame,
} = require('../utils/Game.util');
const { getRandomColorFromGame, getRoomId } = require('../utils/helpers');
const { createPlayer, updatePlayer } = require('../utils/Player.util');

const handleConnection = (socket, io) => {
  socket.on('CREATE_PLAYER', async ({ nick }) => {
    const freeGame = await findFreeGame();

    const color = await getRandomColorFromGame(freeGame);
    const player = await createPlayer({ nick, color });

    await addPlayerToGame(freeGame, player._id);

    const user = {
      id: player._id, gameId: freeGame._id, color, nick,
    };

    const updatedGame = await findGame(freeGame._id);
    const players = await getCurrentGamePlayers(updatedGame);
    socket.emit('JOIN_LOBBY', { user, players });

    socket.playerId = player._id;
    socket.gameId = freeGame._id;

    const roomId = getRoomId(freeGame._id);

    socket.join(roomId);
    socket.to(roomId).emit('UPDATE_LOBBY', players);
  });

  socket.on('CHANGE_STATUS', async (values) => {
    await updatePlayer(socket.playerId, values);
    const game = await findGame(socket.gameId);
    const players = await getCurrentGamePlayers(game);

    const isGameHasStarted = await checkStartGame(game);

    const roomId = getRoomId(socket.gameId);

    isGameHasStarted ? io.to(roomId).emit('START_GAME') : io.to(roomId).emit('UPDATE_LOBBY', players);
  });
};

module.exports = handleConnection;
