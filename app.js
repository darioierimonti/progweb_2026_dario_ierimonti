const express = require('express');
const app = express();
const port = process.env.APP_PORT;
app.get('/', (req, res) => {
    res.send('Welcome');
});
app.listen(port, () => {
    console.log(`Server listening on http://127.0.0.1:${port}/`);
});
