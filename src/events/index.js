const GameService = require('../services/GameService');
const PlayerService = require('../services/PlayerService');
const { getRandomColorFromGame, getRoomId } = require('../utils/helpers');
const DuringGame = require('../utils/DuringGame');
const { Game } = require('../models/game.model');

const handleConnection = (socket, io) => {
  const gameService = new GameService(Game);
  socket.on('CREATE_PLAYER', async ({ nick }) => {
    const freeGame = await gameService.findFreeGame();

    const color = await getRandomColorFromGame(freeGame);
    const player = await PlayerService.createPlayer({ nick, color });

    await gameService.addPlayerToGame(freeGame, player._id);

    const user = {
      id: player._id, gameId: freeGame._id, color, nick,
    };

    const updatedGame = await gameService.findGame(freeGame._id);
    const players = await gameService.getCurrentGamePlayers(updatedGame);
    socket.emit('JOIN_LOBBY', { user, players });

    socket.playerId = player._id;
    socket.gameId = freeGame._id;

    const roomId = getRoomId(freeGame._id);

    socket.join(roomId);
    socket.to(roomId).emit('UPDATE_LOBBY', players);
  });

  socket.on('CHANGE_STATUS', async (values) => {
    await PlayerService.updatePlayer(socket.playerId, values);
    const game = await gameService.findGame(socket.gameId);
    const players = await gameService.getCurrentGamePlayers(game);

    const isGameHasStarted = await gameService.checkStartGame(game);

    const roomId = getRoomId(socket.gameId);

    if (isGameHasStarted) {
      const emitUpdate = (_game) => io.to(roomId).emit('UPDATE_GAME', _game);
      const duringGame = new DuringGame(game, players, emitUpdate);
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
    // only pleyer whos rolled number have available moves
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
