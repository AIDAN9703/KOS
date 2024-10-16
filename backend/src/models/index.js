const sequelize = require('../config/database');
const User = require('./User');
const Boat = require('./Boat');

module.exports = {
  sequelize,
  User,
  Boat
};