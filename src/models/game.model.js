const mongoose =  require('mongoose');
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
        default:  ['red', 'yellow', 'blue' , 'green'],
    }
});


const Game = mongoose.model('game', gameSchema);

module.exports = {Game,  gameSchema}
