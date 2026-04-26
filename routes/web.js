const express = require('express');
const router = express.Router();

// Uncomment to use dynamic routes instead of static routes

router.get('/', (req, res) => {
    res.render('welcome', {
        title: 'Welcome',
    });
});

module.exports = router;
