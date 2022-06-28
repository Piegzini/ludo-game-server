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

const getRoomId = (_id) => `${_id}`;

const getStartedPosition = (color) => {
  let positionNumber = 1;
  switch (color) {
    case 'green':
      positionNumber = 14;
      break;
    case 'gold':
      positionNumber = 27;
      break;
    case 'royalBlue':
      positionNumber = 40;
      break;
  }
  return positionNumber;
};

// const getPlayerAllPositions = (color) => {
//   const startedPositionNumber = getStartedPosition(color);
//   const finishPositions = finishing.filter((position) => position.color === color);
//   return ([...positions.slice(startedPositionNumber, positions.length), ...positions.slice(0, startedPositionNumber - 1), ...finishPositions]);
// };

const equalsId = (firstId, secondId) => firstId.valueOf() === secondId.valueOf();

module.exports = {
  getRandomColorFromGame, getRoomId, getStartedPosition, equalsId,
};
