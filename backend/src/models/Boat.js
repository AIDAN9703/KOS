const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Boat = sequelize.define('Boat', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  length: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  beam: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  draft: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cabins: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  pricePerDay: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  features: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  availableFrom: {
    type: DataTypes.DATE,
    allowNull: false
  },
  availableTo: {
    type: DataTypes.DATE,
    allowNull: false
  },
  maintenanceDate: {
    type: DataTypes.DATE
  },
  licenseNumber: {
    type: DataTypes.STRING
  },
  ownerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ownerPhoneNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ownerEmail: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Boat;
