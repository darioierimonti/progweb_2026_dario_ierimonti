const { after, beforeEach } = require('node:test');
const mysql = require('mysql2/promise');
const { migrate } = require('../migrate');
const { pool } = require('../db');

beforeEach(async () => {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    try {
        await conn.query(`DROP DATABASE IF EXISTS ${mysql.escapeId(process.env.DB_NAME)}`);
    } finally {
        conn.end();
    }

    await migrate({ interactive: false });
});

after(async () => {
    pool.end();
});
