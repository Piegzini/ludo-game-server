const mongoose = require('../db');

const { Schema } = mongoose;

const PlayerSchema = new Schema({
  nick: String, // String is shorthand for {type: String}
  color: String,
  inMove: {
    type: Boolean,
    default: false,
  },
  isReady: {
    type: Boolean,
    default: false,
  },
  pawns: {
    type: Array,
    default: [
      { id: 'first', position: 'base' },
      { id: 'second', position: 'base' },
      { id: 'third', position: 'base' },
      { id: 'fourth', position: 'base' },
    ],
  },
});

const Player = mongoose.model('player', PlayerSchema);

module.exports = { Player, PlayerSchema };
