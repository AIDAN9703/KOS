const express = require('express');
const router = express.Router();
const passport = require('passport');
const checkRole = require('../middleware/checkRole');

// Example route for updating boat information
router.put('/boats/:id', 
  passport.authenticate('jwt', { session: false }),
  checkRole(['owner']),
  async (req, res) => {
    // Implementation for updating boat info
  }
);

// Example route for adding a new boat
router.post('/boats', 
  passport.authenticate('jwt', { session: false }),
  checkRole(['owner']),
  async (req, res) => {
    // Implementation for adding a new boat
  }
);

module.exports = router;