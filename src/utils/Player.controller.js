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

  async get(_id) {
    try {
      return await Player.findById(_id);
    } catch (e) {
      console.error(e);
    }
  }

  async update(_id, values) {
    console.log(_id, values);
    try {
      await Player.findByIdAndUpdate(_id, { ...values });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = PlayerController;
