const { test } = require('node:test');
const assert = require('node:assert');
const app = require('../app');

test('that true is true', async () => {
    assert.strictEqual(true, true);
});
