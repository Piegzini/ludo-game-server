const { Player } = require('../models/player.model');

const createPlayer = async (_values) => {
  const player = new Player({ ..._values });
  try {
    await player.save();
  } catch (e) {
    console.error(e);
  }
  return player;
};

const getPlayer = async (_id) => {
  let foundedPlayer;
  try {
    foundedPlayer = await Player.findById(_id);
  } catch (e) {
    console.error(e);
  }
  return foundedPlayer;
};

const updatePlayer = async (_id, _values) => {
  try {
    await Player.findByIdAndUpdate(_id, { ..._values });
  } catch (e) {
    console.log(e);
  }
};

module.exports = { createPlayer, getPlayer, updatePlayer };
