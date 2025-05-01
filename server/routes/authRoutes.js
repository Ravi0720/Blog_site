const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
require('../auth/github')(passport);
require('../auth/google')(passport);

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.login(user, (err) => {
            if (err) return res.status(500).json({ message: 'Login failed' });
            res.json({ message: 'Logged in', user });
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login.html' }), (req, res) => {
    res.redirect('/index.html');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login.html' }), (req, res) => {
    res.redirect('/index.html');
});

module.exports = router;