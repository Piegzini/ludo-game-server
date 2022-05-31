const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:admin@ludo-game.yw3mx.mongodb.net/ludo-game-react?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to Mongoose')).catch((e) => console.log(e));

module.exports = mongoose;
