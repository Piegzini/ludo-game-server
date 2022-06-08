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

const getRoomId = (_id) => `${_id.valueOf()}`;

const getStartedPosition = ({ color }) => {
  let positionNumber = 0;
  switch (color) {
    case 'green':
      positionNumber = 13;
      break;
    case 'gold':
      positionNumber = 26;
      break;
    case 'royalBlue':
      positionNumber = 39;
      break;
  }
  return positionNumber;
};

module.exports = { getRandomColorFromGame, getRoomId, getStartedPosition };
