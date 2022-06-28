require('dotenv').config();
const mongoose = require('mongoose');

module.exports = mongoose;

mongoose.connect(process.env.DB_KEY, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to Mongoose')).catch((e) => console.log(e));
