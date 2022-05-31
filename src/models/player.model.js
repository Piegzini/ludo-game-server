const mongoose = require('../db');

const { Schema } = mongoose;

const PlayerSchema = new Schema({
  nick: String, // String is shorthand for {type: String}
  color: String,
  inMove: Boolean,
  isReady: Boolean,
  pawns: [],
});

const Player = mongoose.model('player', PlayerSchema);

module.exports = { Player, PlayerSchema };
