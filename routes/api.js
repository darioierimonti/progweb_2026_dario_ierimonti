const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', (req, res) => {
    res.json({ message: 'Welcome'});
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if(!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    if(!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    if(!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    if(password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        await User.create({ name, email, password });
    } catch (err) {
        if(err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: 'Failed to register user' });
    }

    res.json({ message: 'User registered'});
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if(!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    if(!password) {
        return res.status(400).json({ error: 'Password is required' });
    }

    const user = await User.authenticate(email, password);

    if(!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.cookie('token', user.token, { httpOnly: true });

    res.json({ message: 'Login successful'});
});

module.exports = router;
