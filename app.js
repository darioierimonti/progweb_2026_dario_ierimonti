const express = require('express');
const app = express();

app.use(express.json());

app.set('view engine', 'ejs')

/**
 * load routes
 */
app.use('/', require('./routes/web'));
app.use('/api', require('./routes/api'));

app.use(express.static(__dirname + '/public'));

module.exports = app;
