const { before, after } = require('node:test');
const app = require('../app');
const { pool } = require('../db');

const page = {
    baseUrl: null,
    visit: async function(path) {
        return await fetch(`${this.baseUrl}${path}`);
    }
};

let server;

before(() => {
    server = app.listen();
    page.baseUrl = `http://localhost:${server.address().port}`;
});

after(async () => {
    server.close();
    pool.end();
});

module.exports = page;
