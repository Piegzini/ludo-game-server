class DuringGame {
  static DuringGames = [];

  static turnTime = 40;

  constructor({ _id }, _players) {
    this.id = _id;
    this.players = _players;
    this.turnTime = DuringGame.turnTime;
    this.rolledNumber = null;
    this.turnTimeInterval = {};
    this.playerWithMove = this.players[0];
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
    const indexOfCurrentTurnPlayer = this.players.findIndex(({ _id }) => _id === this.playerWithMove._id);
    const nextPlayerIndex = indexOfCurrentTurnPlayer + 1 >= this.players.length ? 0 : indexOfCurrentTurnPlayer + 1;
    this.playerWithMove = this.players[nextPlayerIndex];
  }

  rollNumber() {
    const min = 1;
    const max = 7;
    this.rolledNumber = Math.floor(Math.random() * (max - min)) + min;
  }
}

module.exports = DuringGame;
