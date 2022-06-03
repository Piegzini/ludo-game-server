const { findFreeGame, addPlayerToGame, getCurrentGamePlayers } = require('../utils/Game.util');
const { getRandomColorFromGame, getRoomId } = require('../utils/helpers');
const { createPlayer, updatePlayer } = require('../utils/Player.util');

const handleConnection = (socket) => {
  socket.on('CREATE_PLAYER', async ({ nick }) => {
    const freeGame = await findFreeGame();

    const color = await getRandomColorFromGame(freeGame);
    const player = await createPlayer({ nick, color });

    await addPlayerToGame(freeGame._id, player._id);

    socket.join(freeGame._id.toString());

    const user = {
      id: player._id, gameId: freeGame._id, color, nick,
    };

    const players = await getCurrentGamePlayers(freeGame._id);
    socket.emit('JOIN_LOBBY', { user, players });

    socket.playerId = player._id;
    socket.gameId = freeGame._id;

    const roomId = getRoomId(freeGame._id);
    socket.to(roomId).emit('UPDATE_LOBBY', players);
  });

  socket.on('CHANGE_STATUS', async (values) => {
    const { gameId } = socket;

    await updatePlayer(socket.playerId, values);
    const players = await getCurrentGamePlayers(socket.gameId);

    const roomId = getRoomId(gameId);
    socket.to(roomId).emit('UPDATE_LOBBY', players);
  });
};

module.exports = handleConnection;
