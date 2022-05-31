const { Game } = require('../models/game.model');

const getRandomColorFromGame = async (game) => {
  const { availableColors } = game;
  console.log(availableColors);
  const randomNumber = Math.floor(Math.random() * availableColors.length);
  const color = availableColors[randomNumber];
  try {
    await Game.updateOne({ $pull: { availableColors: color } });
  } catch (error) {
    console.error(error);
  }
  return color;
};

module.exports = { getRandomColorFromGame };
