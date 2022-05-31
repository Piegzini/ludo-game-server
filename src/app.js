const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const GameController = require('./utils/Game.controller');
const { getRandomColorFromGame } = require('./utils/helpers');
const PlayerController = require('./utils/Player.controller');

const app = express();

app.use(cors());
app.use(helmet());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/player', async (req, res) => {
  const { nick } = req.body;
  const gameController = new GameController();
  const freeGame = await gameController.findFreeGame();
  const color = await getRandomColorFromGame(freeGame);

  const { create } = new PlayerController();
  const player = await create({ nick, color });
  await gameController.addPlayer(freeGame._id, player._id);
  res.send('dupa');
});

module.exports = app;
