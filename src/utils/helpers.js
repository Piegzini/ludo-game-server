const { finishing, positions } = require('../positions');

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

const getStartedPosition = (color) => {
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

const getPlayerAllPositions = (color) => {
  const startedPositionNumber = getStartedPosition(color);
  const finishPositions = finishing.filter((position) => position.color === color);
  return ([...positions.slice(startedPositionNumber, positions.length), ...positions.slice(0, startedPositionNumber), ...finishPositions]);
};

module.exports = {
  getRandomColorFromGame, getRoomId, getStartedPosition, getPlayerAllPositions,
};
