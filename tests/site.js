const { before, after } = require('node:test');
const app = require('../app');
const { pool } = require('../db');

const page = {
    baseUrl: null,

    visit: async function(path) {
        return await fetch(`${this.baseUrl}${path}`);
    },

    post: async function(path, data) {
        return await fetch(`${this.baseUrl}${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    }
};

let server;

before(() => {
    server = app.listen();
    page.baseUrl = `http://localhost:${server.address().port}`;
});

after(async () => {
    server.close();
});

module.exports = page;
