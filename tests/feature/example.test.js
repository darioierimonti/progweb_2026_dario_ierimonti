const { test } = require('node:test');
const assert = require('node:assert');
const page = require('../site');

test('Homepage return 200 Ok', async () => {
    const res = await page.visit('/');

    assert.strictEqual(res.status, 200);
});

test('Homepage contains "Welcome"', async () => {
    const res = await page.visit('/');
    const body = await res.text();
    assert.ok(body.includes('Welcome'));
})
