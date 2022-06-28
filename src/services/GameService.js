const { getPlayer } = require('../utils/Player.util');

class GameService {
  constructor(_model) {
    this.Model = _model;
    this.minPlayersToStart = 2;
  }

  async createRoom() {
    const game = new this.Model();
    try {
      await game.save();
    } catch (error) {
      console.error(error);
    }
    return game;
  }

  async findFreeGame() {
    let freeRooms;
    try {
      freeRooms = await this.Model.find({
        $or: [{ players: { $size: 0 } }, { players: { $size: 1 } },
          { players: { $size: 2 } }, { players: { $size: 3 } }],
      });
    } catch (e) {
      freeRooms = null;
    }

    if (freeRooms) {
      const chooseRoomForPlayer = freeRooms.find(({ isDuring }) => isDuring === false);
      if (chooseRoomForPlayer) {
        return chooseRoomForPlayer;
      }
    }

    return await this.createRoom();
  }

  async findGame(_gameId) {
    try {
      return await this.Model.findById(_gameId);
    } catch (e) {
      console.error(e);
    }

    return {};
  }

  // eslint-disable-next-line class-methods-use-this
  async startGame(_game) {
    const game = _game;

    if (game.isDuring) return;
    game.isDuring = true;

    try {
      await game.save();
    } catch (e) {
      console.error(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getCurrentGamePlayers({ players }) {
    try {
      return await Promise.all(players.map(async (id) => await getPlayer(id)));
    } catch (e) {
      console.log(e);
    }
    return players;
  }

  // eslint-disable-next-line class-methods-use-this
  async addPlayerToGame(_game, _playerId) {
    try {
      await _game.updateOne({ $push: { players: _playerId } });
    } catch (error) {
      console.error(error);
    }
  }

  async checkStartGame(_game) {
    const players = await this.getCurrentGamePlayers(_game);

    const readyPlayers = players.filter(({ isReady }) => isReady);

    const areThereMoreThanTwoPlayers = players.length >= this.minPlayersToStart;
    const allPlayersReady = readyPlayers.length === players.length;

    if (areThereMoreThanTwoPlayers && allPlayersReady) {
      await this.startGame(_game);
      return true;
    }
    return false;
  }
}

module.exports = GameService;
