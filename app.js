const express = require('express');
const app = express();

app.use(express.json());

/**
 * load routes
 */
app.use('/', require('./routes/web'));
app.use('/api', require('./routes/api'));

module.exports = app;
