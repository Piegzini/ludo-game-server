const mongoose = require('../db');

const { Schema } = mongoose;

const gameSchema = new Schema({
  players: [],
  isDuring: {
    type: Boolean,
    default: false,
  },
  turnTime: {
    type: Number,
    default: 40,
  },
  rolledNumber: {
    type: Number,
    default: 0,
  },
  availableColors: {
    type: Array,
    default: ['red', 'gold', 'royalBlue', 'green'],
  },
});

const Game = mongoose.model('game', gameSchema);

class GameService extends Game {
  constructor() {
    super();
    this.freeRooms = null;
    this.freeRoom = null;
  }

  async findFreeGame() {
    let freeRooms;
    try {
      freeRooms = await Game.find({
        $or: [
          { players: { $size: 0 } },
          { players: { $size: 1 } },
          { players: { $size: 2 } },
          { players: { $size: 3 } }],
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

    return createRoom();
  }
}

module.exports = { Game, gameSchema };
