const mongoose = require('../databases/Mongo');

const { Schema } = mongoose;

const roomSchema = new Schema({
  players: [],
  isDuring: {
    type: Boolean,
    default: false,
  },
  availableColors: {
    type: Array,
    default: ['red', 'gold', 'royalBlue', 'green'],
  },
});

const Room = mongoose.model('room', roomSchema);

module.exports = { Room };
