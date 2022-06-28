const mongoose = require('mongoose');
require('dotenv').config();

module.exports = mongoose;

mongoose.connect(process.env.DB_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to Mongoose')).catch((e) => console.log(e));
