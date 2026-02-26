const express = require('express');
const router = express.Router();

// Simple mock login for testing Vercel connectivity
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt: ${email}`);

    // We'll mimic the admin login logic
    if ((email === 'admin@myzapcast.az' || email === 'admin') && password === 'toghruladmin123') {
        return res.status(200).json({
            success: true,
            user: { name: 'Admin', email: 'admin@myzapcast.az', role: 'admin' },
            token: 'mock-jwt-token'
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Yanlış admin adı və ya şifrə!'
    });
});

module.exports = router;
