const { Player } = require('../models/player.model');

const PlayerService = {
  Model: Player,
  async createPlayer(_values) {
    try {
      const player = new this.Model({ ..._values });
      await player.save();

      return player;
    } catch (e) {
      console.error(e);
    }
    return {};
  },

  async getPlayer(_id) {
    try {
      return await Player.findById(_id);
    } catch (e) {
      console.error(e);
    }
    return {};
  },

  async updatePlayer(_id, _values) {
    try {
      await Player.findByIdAndUpdate(_id, { ..._values });
    } catch (e) {
      console.error(e);
    }
  },
};

module.exports = PlayerService;
