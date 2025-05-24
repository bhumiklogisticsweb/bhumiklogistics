require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { body } = require('express-validator');
const contactController = require('./controllers/contactController');
const rateLimiter = require('./middlewares/rateLimiter');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',//'https://yourfrontenddomain.com', // Replace with your real GoDaddy domain
  methods: ['POST'],
}));
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.post(
    '/contact',
    // rateLimiter,
    [
        body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
        body('email').isEmail().withMessage('Invalid email'),
        body('phone').matches(/^[0-9]{8,15}$/).withMessage('Phone must be 8–15 digits'),
        body('message').notEmpty().withMessage('Message is required'),
    ],
    contactController.handleContactForm
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
