require('dotenv').config();
if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set in the environment variables');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const passport = require('passport');

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const ownerRoutes = require('./routes/owner');
const boatRoutes = require('./routes/boats');
const chatRoutes = require('./routes/chat');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000' // or your frontend URL
}));
app.use(express.json());
app.use(passport.initialize());

// Passport config
require('./config/passport')(passport);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/boats', boatRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log('Error syncing database:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database connection test
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Error connecting to the database:', err));