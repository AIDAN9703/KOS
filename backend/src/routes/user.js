const express = require('express');
const router = express.Router();
const passport = require('passport');

// Get current user
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role  // Add this line to include the role
    });
  }
);

module.exports = router;
