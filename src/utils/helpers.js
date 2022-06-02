const getRandomColorFromGame = async (game) => {
  const { availableColors } = game;
  const randomNumber = Math.floor(Math.random() * availableColors.length);
  const color = availableColors[randomNumber];
  try {
    await game.updateOne({ $pull: { availableColors: color } });
  } catch (error) {
    console.error(error);
  }
  return color;
};

module.exports = { getRandomColorFromGame };
