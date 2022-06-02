const { get } = require('mongoose');
const { Game } = require('../models/game.model');
const PlayerController = require('./Player.controller');

class GameController {
  constructor() {
  }

  async createRoom() {
    const game = new Game();

    try {
      await game.save();
    } catch (error) {
      console.log(error);
    }
    return game;
  }

  async findFreeGame() {
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

    return this.createRoom();
  }

  async getPlayers(_gameId) {
    const playerController = new PlayerController();
    let game = {};
    try {
      game = await Game.findById(_gameId);
    } catch (e) {
      console.log(e);
    }

    const { players } = game;
    return await Promise.all(players.map(async (id) => await playerController.get(id)));
  }

  async addPlayer(_gameId, _playerId) {
    try {
      const game = await Game.findOne({ _id: _gameId });
      await game.updateOne({ $push: { players: _playerId } });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = GameController;
