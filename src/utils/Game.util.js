const { Game } = require('../models/game.model');
const { getPlayer } = require('./Player.util');

const createRoom = async () => {
  const game = new Game();
  try {
    await game.save();
  } catch (error) {
    console.log(error);
  }
  return game;
};

const findFreeGame = async () => {
  let freeRooms;
  try {
    freeRooms = await Game.find({
      $or: [
        { players: { $size: 0 } },
        { players: { $size: 1 } },
        { players: { $size: 2 } },
        { players: { $size: 3 } },
      ],
    });
  } catch (e) {
    console.error(e);
  }

  if (freeRooms) {
    const chooseRoomForPlayer = freeRooms.find(({ isDuring }) => isDuring === false);
    if (chooseRoomForPlayer) {
      return chooseRoomForPlayer;
    }
  }

  return createRoom();
};

const findGame = async (_gameId) => {
  let game = {};
  try {
    game = await Game.findById(_gameId);
  } catch (e) {
    console.log(e);
  }
  return game;
};

const getCurrentGamePlayers = async ({ players }) => {
  let playersDetails;
  try {
    playersDetails = await Promise.all(players.map(async (id) => await getPlayer(id)));
  } catch (e) {
    console.log(e);
  }
  return playersDetails;
};

const addPlayerToGame = async (game, _playerId) => {
  try {
    await game.updateOne({ $push: { players: _playerId } });
  } catch (error) {
    console.log(error);
  }
};

const startGame = async (_game) => {
  const game = _game;
  if (game.isDuring) return;

  game.isDuring = true;

  try {
    await game.save();
  } catch (e) {
    console.log(e);
  }
};

const checkStartGame = async (_game) => {
  const players = await getCurrentGamePlayers(_game);

  const readyPlayers = players.filter(({ isReady }) => isReady);

  const areThereMoreThanTwoPlayers = players.length >= 1;
  // const allPlayersReady = readyPlayers.length === players.length;
  const allPlayersReady = true;
  if (areThereMoreThanTwoPlayers && allPlayersReady) {
    await startGame(_game);
    return true;
  }
  return false;
};

module.exports = {
  createRoom, findFreeGame, getCurrentGamePlayers, addPlayerToGame, checkStartGame, findGame,
};
