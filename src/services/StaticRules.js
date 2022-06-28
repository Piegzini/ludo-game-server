class StaticRules {
  #rangeToRoll;

  constructor() {
    this.turnTime = 10;
    this.#rangeToRoll = { max: 7, min: 1 };
    this.rolledNumber = null;
    this.hasPlayerRolledNumber = false;
    this.newTurn = true;
    this.isDuring = true;
  }

  rollNumber() {
    const { min, max } = this.#rangeToRoll;
    if (this.hasPlayerRolledNumber) return;

    this.rolledNumber = Math.floor(Math.random() * (max - min)) + min;
    this.hasPlayerRolledNumber = true;
    this.newTurn = false;
  }
}

module.exports = StaticRules;
