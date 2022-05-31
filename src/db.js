const mongoose =  require('mongoose');
const {Game} = require("./models/game.model");

const main = async () => {
    try{
        await mongoose.connect('mongodb+srv://admin:admin@ludo-game.yw3mx.mongodb.net/ludo-game-react?retryWrites=true&w=majority',  {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
    }catch(e){
        console.log(e)
    }
}


