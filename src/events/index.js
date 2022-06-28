const RoomService = require('../services/RoomService');
const PlayerService = require('../services/PlayerService');
const { getRandomColorFromGame, getRoomId, equalsId } = require('../utils/helpers');
const { Room } = require('../models/room.model');
const Game = require('../utils/Game');

const handleConnection = (socket, io) => {
  const roomService = new RoomService(Room);
  socket.on('CREATE_PLAYER', async ({ nick }) => {
    const freeGame = await roomService.findFreeRoom();

    const color = await getRandomColorFromGame(freeGame);
    const player = await PlayerService.createPlayer({ nick, color });

    await roomService.addPlayerToRoom(freeGame, player._id);

    const user = {
      id: player._id, gameId: freeGame._id, color, nick,
    };

    const updatedGame = await roomService.findRoom(freeGame._id);
    const players = await roomService.getCurrentRoomPlayers(updatedGame);
    socket.emit('JOIN_LOBBY', { user, players });

    socket.playerId = player._id;
    socket.gameId = freeGame._id.valueOf();

    const roomId = getRoomId(freeGame._id);

    socket.join(roomId);
    socket.to(roomId).emit('UPDATE_LOBBY', players);
  });

  socket.on('CHANGE_STATUS', async (values) => {
    await PlayerService.updatePlayer(socket.playerId, values);
    const game = await roomService.findRoom(socket.gameId);
    const players = await roomService.getCurrentRoomPlayers(game);

    const isGameHasStarted = await roomService.checkStartGame(game);

    const roomId = getRoomId(socket.gameId);

    if (isGameHasStarted) {
      const emitUpdate = (_game) => io.to(roomId).emit('UPDATE_GAME', _game);
      const duringGame = new Game(game, players, emitUpdate);
      io.to(roomId).emit('START_GAME', duringGame);
    } else {
      io.to(roomId).emit('UPDATE_LOBBY', players);
    }
  });

  socket.on('ROLL_NUMBER', () => {
    const { gameId } = socket;
    const game = Game.findGame(gameId);
    if (socket.playerId.valueOf() !== game.playerWithMove.valueOf()) return;

    game.rollNumber();
    const availableMoves = game.getAvailableMoves();
    const roomId = getRoomId(gameId);

    socket.to(roomId).emit('UPDATE_GAME', game);
    // only pleyer whos rolled number have available moves
    const gameWithAvailableMoves = { ...game, availableMoves };
    io.to(socket.id).emit('UPDATE_GAME', gameWithAvailableMoves);
  });

  socket.on('MOVE', ({ pawnId }) => {
    const { gameId } = socket;
    const { playerId } = socket;
    const game = Game.findGame(gameId);

    const isPlayerWithMove = equalsId(playerId, game.playerWithMove);
    if (!isPlayerWithMove) return;

    game.move(playerId, pawnId);

    const roomId = getRoomId(gameId);
    io.to(roomId).emit('UPDATE_GAME', game);
  });
};

module.exports = handleConnection;
