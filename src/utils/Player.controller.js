const { Player } = require('../models/player.model');

class PlayerController {
  async create(props) {
    const player = new Player({ ...props });
    try {
      await player.save();
    } catch (e) {
      console.error(e);
    }
    return player;
  }

  async getPlayer(_id) {
    try {
      return await Player.findById(_id);
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = PlayerController;
