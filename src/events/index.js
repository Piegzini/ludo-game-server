const {
  findFreeGame,
  addPlayerToGame,
  getCurrentGamePlayers,
  checkStartGame, findGame,
} = require('../utils/Game.util');
const { getRandomColorFromGame, getRoomId } = require('../utils/helpers');
const { createPlayer, updatePlayer } = require('../utils/Player.util');
const DuringGame = require('../utils/DuringGame');

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

    if (isGameHasStarted) {
      const duringGame = new DuringGame(game, players);
      io.to(roomId).emit('START_GAME', duringGame);
    } else {
      io.to(roomId).emit('UPDATE_LOBBY', players);
    }
  });

  socket.on('ROLL_NUMBER', () => {
    const duringGame = DuringGame.all.find((game) => game.id.valueOf() === socket.gameId.valueOf());
    if (socket.playerId.valueOf() !== duringGame.playerWithMove.valueOf()) return;

    duringGame.rollNumber();
    const availableMoves = duringGame.getAvailableMoves();
    const roomId = getRoomId(socket.gameId);

    socket.to(roomId).emit('UPDATE_GAME', duringGame);
    // only pleyer whos rolled numbe have available moves
    const gameWithAvailableMoves = { ...duringGame, availableMoves };
    io.to(socket.id).emit('UPDATE_GAME', gameWithAvailableMoves);
  });

  socket.on('MOVE', ({ pawnId }) => {
    const duringGame = DuringGame.all.find((game) => game.id.valueOf() === socket.gameId.valueOf());
    if (socket.playerId.valueOf() !== duringGame.playerWithMove.valueOf()) return;

    duringGame.move(socket.playerId, pawnId);

    const roomId = getRoomId(socket.gameId);
    io.to(roomId).emit('UPDATE_GAME', duringGame);
  });
};

module.exports = handleConnection;
