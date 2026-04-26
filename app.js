const express = require('express');
const app = express();
const port = process.env.APP_PORT;

app.use(express.json());

/**
 * load routes
 */
app.use('/', require('./routes/web'));
app.use('/api', require('./routes/api'));

app.listen(port, () => {
    console.log(`Server listening on http://127.0.0.1:${port}/`);
});
