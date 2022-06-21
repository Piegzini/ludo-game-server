const { getStartedPosition } = require('./helpers');
const positions = require('../positions');

class DuringGame {
  static all = [];

  static turnTime = 10;

  #turnTimeOut;

  constructor({ _id }, _players, _emitUpdate) {
    this.id = _id;
    this.players = _players;
    this.rolledNumber = null;
    this.playerWithMove = this.players[0]._id;
    this.hasPlayerRolledNumber = false;
    this.turnTime = DuringGame.turnTime;
    this.newTurn = true;
    this.emitUpdate = _emitUpdate;

    DuringGame.all.push(this);
    this.startTurnTime();
  }

  startTurnTime() {
    clearTimeout(this.#turnTimeOut);

    this.#turnTimeOut = setTimeout(() => {
      this.setNextPlayer();
      this.emitUpdate(this);
    }, DuringGame.turnTime * 1000);
  }

  setNextPlayer() {
    const indexOfCurrentTurnPlayer = this.players.findIndex(({ _id }) => _id.valueOf() === this.playerWithMove.valueOf());
    const nextPlayerIndex = indexOfCurrentTurnPlayer + 1 >= this.players.length ? 0 : indexOfCurrentTurnPlayer + 1;
    this.playerWithMove = this.players[nextPlayerIndex]._id;
    this.hasPlayerRolledNumber = false;
    this.newTurn = true;
    this.startTurnTime();
  }

  rollNumber() {
    const min = 1;
    const max = 7;
    if (this.hasPlayerRolledNumber) return;

    this.rolledNumber = Math.floor(Math.random() * (max - min)) + min;
    this.hasPlayerRolledNumber = true;
    this.newTurn = false;
  }

  getAvailableMoves() {
    this.newTurn = false;

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

      return { id, position: positions[nextPositionId] };
    });

    availableMoves = availableMoves.filter((move) => move !== false);

    console.log(availableMoves);
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

  move(playerId, pawnId) {
    this.newTurn = false;
    const player = this.players.find(({ _id }) => _id.valueOf() === playerId.valueOf());
    const availableMoves = this.getAvailableMoves();

    const choseMove = availableMoves.find((availableMove) => availableMove?.id === pawnId);
    const pawn = player.pawns.find(({ id }) => id === pawnId);
    pawn.position = choseMove.position;

    this.checkBeating(choseMove.position.id);
    this.setNextPlayer();
  }
}

module.exports = DuringGame;
