const express = require('express');
const router = express.Router();
const { Boat } = require('../models');
const { Op } = require('sequelize');
const passport = require('passport');
const checkRole = require('../middleware/checkRole');
const Sequelize = require('sequelize');

// Get random featured boats
router.get('/featured', async (req, res) => {
  try {
    const featuredBoats = await Boat.findAll({
      order: Sequelize.literal('RANDOM()'),
      limit: 10
    });
    console.log('Featured boats:', featuredBoats); // Add this line for debugging
    res.json(featuredBoats);
  } catch (err) {
    console.error('Error in /featured route:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all boats with filters
router.get('/', async (req, res) => {
  try {
    const { location, type, minCapacity, maxPrice } = req.query;
    const whereClause = {};

    if (location) whereClause.location = location;
    if (type) whereClause.type = type;
    if (minCapacity) whereClause.capacity = { [Op.gte]: minCapacity };
    if (maxPrice) whereClause.pricePerDay = { [Op.lte]: maxPrice };

    const boats = await Boat.findAll({ where: whereClause });
    res.json(boats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search boats with filters
router.get('/search', async (req, res) => {
  const { query, location, type, minCapacity, maxPrice } = req.query;
  try {
    const whereClause = {
      [Op.and]: [
        {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { type: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } }
          ]
        }
      ]
    };

    if (location) whereClause[Op.and].push({ location });
    if (type) whereClause[Op.and].push({ type });
    if (minCapacity) whereClause[Op.and].push({ capacity: { [Op.gte]: minCapacity } });
    if (maxPrice) whereClause[Op.and].push({ pricePerDay: { [Op.lte]: maxPrice } });

    const boats = await Boat.findAll({ where: whereClause });
    res.json(boats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single boat by ID
router.get('/:id', async (req, res) => {
  try {
    const boat = await Boat.findByPk(req.params.id);
    if (!boat) {
      return res.status(404).json({ message: 'Boat not found' });
    }
    res.json(boat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new boat
router.post('/', 
  passport.authenticate('jwt', { session: false }),
  checkRole(['owner']),
  async (req, res) => {
    try {
      const newBoat = await Boat.create({
        ...req.body,
        ownerId: req.user.id
      });
      res.json(newBoat);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  }
);

module.exports = router;
