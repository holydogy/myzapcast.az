require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Serve Static Files (Uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myzapcast';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB-yə qoşuldu'))
    .catch((err) => console.error('❌ MongoDB qoşulma xətası:', err));

// Basic Routes Placeholder
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server işləyir' });
});

// Import Routes (To be implemented)
// const authRoutes = require('./routes/authRoutes');
// const adRoutes = require('./routes/adRoutes');

// app.use('/api/auth', authRoutes);
// app.use('/api/ads', adRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Server xətası baş verdi',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda aktivdir`);
});
