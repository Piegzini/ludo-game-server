const { Player } = require('../models/player.model');

class PlayerController {
  async create(props) {
    console.log(props);
    const player = new Player({ ...props });
    try {
      await player.save();
    } catch (e) {
      console.error(e);
    }
    return player;
  }
}

module.exports = PlayerController;
