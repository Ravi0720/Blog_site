const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/payments', paymentRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Blog Site API is running');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});