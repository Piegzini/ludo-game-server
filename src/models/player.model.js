const mongoose =  require('mongoose');
const { Schema } = mongoose;

const PlayerSchema = new Schema({
    nick:  String, // String is shorthand for {type: String}
    color: ['red', 'yellow', 'blue' , 'green'],
    inMove: Boolean,
    isReady: Boolean,
    pawns: []

});

const Player = mongoose.model('player', PlayerSchema);

module.exports = {Player,  PlayerSchema}
