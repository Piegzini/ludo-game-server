const StaticRules = require('./StaticRules');
const Redis = require('../databases/Redis');
const { equalsId } = require('../utils/helpers');

class Game extends StaticRules {
  static all = [];

  static findGame(_id) {
    return Game.all.find((game) => game.id === _id);
  }

  #turnTimeOut;

  constructor({ _id }, _players, _emitUpdate) {
    super();
    this.id = _id.valueOf();
    this.players = _players;
    this.playerWithMove = this.players[0]._id;
    this.emitUpdate = _emitUpdate;
    this.availableMoves = [];

    Game.all.push(this);
    this.startTurnTime();
  }

  startTurnTime() {
    clearTimeout(this.#turnTimeOut);

    this.#turnTimeOut = setTimeout(() => {
      this.setNewTurn();
      this.emitUpdate(this);
    }, this.turnTime * 1000);
  }

  setNewTurn() {
    this.setNextPlayer();

    this.hasPlayerRolledNumber = false;
    this.rolledNumber = 0;
    this.newTurn = true;
    this.startTurnTime();
  }

  setNextPlayer() {
    const indexOfCurrentTurnPlayer = this.players.findIndex(({ _id }) => equalsId(_id, this.playerWithMove));
    const nextPlayerIndex = indexOfCurrentTurnPlayer + 1 >= this.players.length ? 0 : indexOfCurrentTurnPlayer + 1;
    this.playerWithMove = this.players[nextPlayerIndex]._id;
  }

  async getAvailableMoves() {
    this.newTurn = false;

    const playerWithMove = this.players.find(({ _id }) => equalsId(_id, this.playerWithMove));
    let playerAllPositions = await Redis.get(`positions:${playerWithMove.color}`);
    playerAllPositions = JSON.parse(playerAllPositions);

    let availableMoves = playerWithMove.pawns.map(({ id, position }) => {
      if (position === 'base') {
        const canBeAddedToBoard = this.rolledNumber === 1 || this.rolledNumber === 6;
        const pawn = { id, position: playerAllPositions[0] };
        return canBeAddedToBoard && pawn;
      }

      const indexOfCurrentPosition = playerAllPositions.findIndex(({ id }) => id === position.id);
      const nextPositionIndex = indexOfCurrentPosition + this.rolledNumber;

      if (nextPositionIndex >= playerAllPositions.length) return false;

      // moving in ending positions
      const isOtherPawnOnEndingPool = this.checkOtherPawnsInEndingPositions(playerWithMove, nextPositionIndex);
      if (isOtherPawnOnEndingPool) return false;

      return { id, position: playerAllPositions[nextPositionIndex] };
    });

    // cleaner
    availableMoves = availableMoves.filter((move) => move !== false);

    if (availableMoves.length === 0) {
      setTimeout(() => {
        this.setNewTurn();
        this.emitUpdate(this);
      }, 600);
    }

    return availableMoves;
  }

  checkBeating(positionId) {
    const othersPlayers = this.players.filter(({ _id }) => !equalsId(_id, this.playerWithMove));

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

  checkWinning({ pawns }) {
    const winningIdsOfPools = [53, 54, 55, 56];
    return pawns.every(({ position }) => winningIdsOfPools.includes(position.id));
  }

  checkOtherPawnsInEndingPositions({ pawns }, nextPositionIndex) {
    if (nextPositionIndex >= 51) {
      const onTheSamePositions = pawns.filter(({ position }) => position.id === nextPositionIndex);
      return onTheSamePositions.length > 0;
    }
    return false;
  }

  async move(playerId, pawnId) {
    this.newTurn = false;
    const player = this.players.find(({ _id }) => equalsId(_id, playerId));
    const availableMoves = await this.getAvailableMoves();

    const choseMove = availableMoves.find((availableMove) => availableMove?.id === pawnId);
    const pawn = player.pawns.find(({ id }) => id === pawnId);
    pawn.position = choseMove.position;

    this.checkBeating(choseMove.position.id);
    this.checkWinning(player);
    this.setNewTurn();
  }
}

module.exports = Game;
