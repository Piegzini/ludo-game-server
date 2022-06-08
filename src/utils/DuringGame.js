const { getStartedPosition } = require('./helpers');
const positions = require('../positions');

class DuringGame {
  static all = [];

  static turnTime = 40;

  constructor({ _id }, _players) {
    this.id = _id;
    this.players = _players;
    this.turnTime = DuringGame.turnTime;
    this.rolledNumber = null;
    this.turnTimeInterval = {};
    this.playerWithMove = this.players[0]._id;

    DuringGame.all.push(this);
  }

  elapsedTurnTime() {
    if (this.turnTime <= 0) {
      this.setNextPlayer();
      this.turnTime = DuringGame.turnTime;
    } else {
      this.turnTime -= 1;
    }
    console.log(`Turn time: ${this.turnTime}`);
  }

  setNextPlayer() {
    const indexOfCurrentTurnPlayer = this.players.findIndex(({ _id }) => _id.valueOf() === this.playerWithMove.valueOf());
    const nextPlayerIndex = indexOfCurrentTurnPlayer + 1 >= this.players.length ? 0 : indexOfCurrentTurnPlayer + 1;
    this.playerWithMove = this.players[nextPlayerIndex]._id;
  }

  rollNumber() {
    const min = 1;
    const max = 7;
    this.rolledNumber = Math.floor(Math.random() * (max - min)) + min;
  }

  getAvailableMoves() {
    const playerWithMove = this.players.find((player) => player._id.valueOf() === this.playerWithMove.valueOf());
    const startedPosition = getStartedPosition(playerWithMove);

    let availableMoves = playerWithMove.pawns.map(({ id, position }) => {
      if (position === 'base') {
        const canBeAddedToBoard = this.rolledNumber === 1 || this.rolledNumber === 6;
        const pawn = { id, position: positions[startedPosition] };
        return canBeAddedToBoard && pawn;
      }

      const nextPositionId = position.id + this.rolledNumber >= positions.length
        ? (position.id + this.rolledNumber) % positions.length
        : position.id + this.rolledNumber;

      // this.checkBeating(nextPositionId);

      return { id, position: positions[nextPositionId] };

      // const positionId = position.id;
      // return { id, position: positions[positionId + this.rolledNumber] };
    });

    availableMoves = availableMoves.filter((move) => move !== false);

    if (availableMoves.length === 0) this.setNextPlayer();

    return availableMoves;
  }

  checkBeating(positionId) {
    const othersPlayers = this.players.filter((player) => player._id.valueOf() !== this.playerWithMove.valueOf());

    othersPlayers.forEach((otherPlayer) => {
      const pawnOnTheSamePosition = otherPlayer.pawns.filter((pawn) => {
        if (pawn.position.id && pawn.position.id === positionId) return pawn;
      });

      if (pawnOnTheSamePosition.length > 0) {
        pawnOnTheSamePosition.forEach((pawn) => {
          pawn.position = 'base';
        });
      }
    });
  }
}

module.exports = DuringGame;
